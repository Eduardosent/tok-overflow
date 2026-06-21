export function scrollToSection(e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, sectionId: string) {
  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
    window.history.pushState(null, "", `#${sectionId}`);
  }
}