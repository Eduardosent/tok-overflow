import { dumpMovePackage } from "@zktx.io/sui-move-builder";
import { Transaction } from '@mysten/sui/transactions';
import { SuiClientTypes } from "@mysten/sui/client";

export interface TokenCreationParams {
    network: "mainnet" | "testnet" | "devnet";
    senderAddress: string;
    token: {
        symbol: string;        
        name: string;        
        description: string;  
        iconUrl: string;     
        decimals: number;  
    };
}

export interface UploadContractParams {
    network: "mainnet" | "testnet" | "devnet";
    sender: string;
    token: {
        symbol: string;        
        name: string;        
        description: string;  
        iconUrl: string;     
        decimals: number;  
    };
}

export class TokFactory {

    /**
     * Compila y publica el contrato en la red.
     */
    public async uploadContract(params: UploadContractParams): Promise<Transaction> {
        const nameLower = params.token.symbol.toLowerCase();
        const nameUpper = params.token.symbol.toUpperCase();

        const files = {
            "Move.toml": `[package]
            name = "${nameLower}"
            edition = "2024"

            [dependencies]
            tok_issuer = { git = "https://github.com/Eduardosent/tok-packages", subdir = "tok_issuer", rev = "main" }

            [addresses]
            ${nameLower} = "0x0"
            tok_issuer = "0x599e4193987d894aa2444cf7df0500c01cba23f738a614673a65d012066ec4f0"
            `,
            [`sources/${nameLower}.move`]: `module ${nameLower}::${nameLower} {
                use tok_issuer::with_otw;

                public struct ${nameUpper} has drop {}

                fun init(witness: ${nameUpper}, ctx: &mut TxContext) {
                    with_otw::create_token(
                        witness,
                        ${params.token.decimals},
                        b"${params.token.symbol}".to_string(),
                        b"${params.token.name}".to_string(),
                        b"${params.token.description}".to_string(),
                        b"${params.token.iconUrl}".to_string(),
                        ctx
                    );
                }
            }`,
        };

        const compiled = await dumpMovePackage({ files, network: params.network });

        if ("error" in compiled) {
            throw new Error(`[TokSDK] Error al compilar Move: ${compiled.category} -> ${compiled.error}`);
        }

        const tx = new Transaction();
        tx.setSender(params.sender);

        const [upgradeCap] = tx.publish({
            modules: compiled.modules, 
            dependencies: compiled.dependencies
        });

        tx.transferObjects([upgradeCap], tx.pure.address(params.sender));

        return tx;
    }

    /**
     * Orquestador para crear el token llamando a uploadContract.
     */
    public async createToken(params: TokenCreationParams): Promise<Transaction> {
        return await this.uploadContract({
            network: params.network,
            sender: params.senderAddress,
            token: params.token
        });
    }

    // public async finalizeToken(sender: string,publishResult: SuiClientTypes.TransactionResult) {
    //     console.log(publishResult)
    //     // const objectTypes: Record<string, string> = publishResult.Transaction?.objectTypes || {};

    //     // const vaultEntry = Object.entries(objectTypes).find(([_, type]) => type.includes("IssuerVault"));
    //     // const currencyEntry = Object.entries(objectTypes).find(([_, type]) => type.includes("Currency"));
    //     // const packageEntry = Object.entries(objectTypes).find(([_, type]) => type === 'package');

    //     // if (!vaultEntry || !currencyEntry || !packageEntry) {
    //     //     throw new Error("No se pudieron encontrar los objetos completos en objectTypes.");
    //     // }

    //     // const [vaultId, vaultType] = vaultEntry;
    //     // const [currencyId, currencyType] = currencyEntry;
    //     // const [packageId, packageType] = packageEntry;

    //     // const typeArgument = vaultType.split('<')[1]?.replace('>', '');

    //     // if (!typeArgument) {
    //     //     throw new Error("No se pudo extraer el TypeArgument del Vault.");
    //     // }

    //     // console.log("Currency Type:", typeArgument);

    //     // const payTx = new Transaction();
    //     // payTx.setSender(sender);

    //     // // Crear la coin de pago de 0.1 SUI (100,000,000 MIST)
    //     // const [paymentCoin] = payTx.splitCoins(payTx.gas, [payTx.pure.u64(100_000_000)]);

    //     // payTx.moveCall({
    //     //     target: `0x599e4193987d894aa2444cf7df0500c01cba23f738a614673a65d012066ec4f0::with_otw::pay_token`,
    //     //     typeArguments: [
    //     //         typeArgument,
    //     //         "0x2::sui::SUI"
    //     //     ],
    //     //     arguments: [
    //     //         payTx.object("0xc7ad3d5ff0bdf2f9f29271716a4a367d6010698a9d98099ac0ffa5231730846e"),
    //     //         paymentCoin, 
    //     //         payTx.object("0xc"),
    //     //         payTx.object(currencyId),
    //     //         payTx.object(vaultId)
    //     //     ]
    //     // });

    //     // console.log(payTx)
    // }

    public async finalizeToken(sender: string, txDetails: any) {
    const changes = txDetails.objectChanges || [];

    // 1. Extraer los objetos necesarios
    const vault = changes.find((c: any) => c.type === 'created' && c.objectType.includes("IssuerVault"));
    const currency = changes.find((c: any) => c.type === 'created' && c.objectType.includes("Currency"));
    const published = changes.find((c: any) => c.type === 'published');

    if (!vault || !currency || !published) {
        throw new Error("No se pudieron encontrar los objetos necesarios en objectChanges.");
    }

    const vaultId = vault.objectId;
    const currencyId = currency.objectId;
    const packageId = published.packageId;

    // 2. Extraer el TypeArgument del tipo del Vault
    // Ejemplo: 0x599...::with_otw::IssuerVault<0x9f6...::test::TEST>
    const typeArgument = vault.objectType.split('<')[1]?.replace('>', '');

    if (!typeArgument) {
        throw new Error("No se pudo extraer el TypeArgument del Vault.");
    }

    console.log("Currency Type:", typeArgument);
    console.log("IDs encontrados:", { vaultId, currencyId, packageId });

    // 3. Preparar la transacción de pago
    const payTx = new Transaction();
    payTx.setSender(sender);

    const [paymentCoin] = payTx.splitCoins(payTx.gas, [payTx.pure.u64(100_000_000)]);

    payTx.moveCall({
        target: `0x599e4193987d894aa2444cf7df0500c01cba23f738a614673a65d012066ec4f0::with_otw::pay_token`,
        typeArguments: [typeArgument, "0x2::sui::SUI"],
        arguments: [
            payTx.object("0xc7ad3d5ff0bdf2f9f29271716a4a367d6010698a9d98099ac0ffa5231730846e"), // El ID del objeto de pago (asegúrate que sea el correcto)
            paymentCoin, 
            payTx.object("0xc"),
            payTx.object(currencyId),
            payTx.object(vaultId)
        ]
    });

    return payTx;
}
}