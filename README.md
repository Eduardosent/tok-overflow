# TOK

TOK es una infraestructura en la blockchain de Sui para convertir la tokenización en algo cotidiano: desde las cosas comunes como creación y gestión de tokens, stake, vesting, lending, renting y muchas más, mercados como dex, hasta novedosas herramientas financieras como los tokens securities. El gran objetivo es construir un mercado de valores tokenizado.

## Estructura del repositorio

El repositorio está dividido en dos módulos principales:

### `tok-packages`

Contiene el desarrollo de todos los contratos de TOK hasta el momento:

- `tok_fees`
- `tok_issuer`
- `tok_vesting`
- `tok_staking`
- `tok_ido` (launchpad descentralizado) — *incompleto*

Estas versiones de los contratos **no son finales**, son experimentales y tendrán ajustes en el corto plazo. Representan solo la base del ecosistema, porque en el futuro se busca lograr cosas mucho más grandes.

### `tok-frontend`

Contiene todo el diseño de la plataforma, desde la landing hasta los módulos que representan los paquetes de TOK. Estos módulos siguen siendo implementados:

- `tok_fees` y `tok_staking`: disponibles en un par de semanas
- `tok_launchpad`: disponible un par de semanas después, mientras se construye la versión final

## Token TOK

Se piensa emitir un token TOK como utility para recibir financiamiento y poder implementar las características más grandes de la plataforma, a cambio de la posibilidad de ser dueños del proyecto. Por ende, cuando TOK se convierta en un security, se distribuirán las ganancias a los poseedores del token TOK.

## Marco legal y objetivo regulatorio

TOK busca ser regulado bajo la Ley LEAD en El Salvador, con el objetivo de convertirse en un emisor de tokens regulado y poder ofrecer más servicios dentro de ese marco legal.

Obtener este permiso legal es uno de los objetivos centrales del proyecto: es lo que le daría a TOK el respaldo para operar como emisor regulado y, junto con el desarrollo futuro de la plataforma, es la razón por la que se necesita financiamiento.

## Contratos desplegados

| Contrato      | Package ID |
|---------------|------------|
| `tok_fees`    | `0x05029a11fbcfa5d6959a41cce21681a65ecfbb5ee57967e2626272f188c8b653` |
| `tok_issuer`  | `0x88288ba5d35289a4410ec0b93c0aae251724b5eab8df81743c44143c72ccbdd4` |
| `tok_vesting` | `0x2e802e5d290de9ff149e301a4d74be1532472f9fad7c366c96b3d20a2c040de1` |
| `tok_staking` | `0x9c574ca2f0fd43d5c893e911e9f6d37f104a01ff3efd1e14876af195517d3a5f` |

## Requerimientos

- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install)
- [Node.js](https://nodejs.org/)
- npm

## Ejecución

### tok-frontend (Next.js)

```bash
cd tok-frontend
npm i
npm run dev
```

### tok-packages (Sui Move)

Entrar a cada paquete y correr los tests, por ejemplo:

```bash
cd tok-packages/tok_fees
sui move test
```

Repetir el mismo paso para cada paquete (`tok_issuer`, `tok_vesting`, `tok_staking`, `tok_ido`).