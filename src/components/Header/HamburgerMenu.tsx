import Image from "next/image";
import MenuHamburger from "/public/icon-menu.svg";

export function HamburgerMenu() {
  return (
    <button className=" hidden p-4 tablet:block" title="Abrir Menu">
      <Image src={MenuHamburger} alt="Menu" />
    </button>
  );
}