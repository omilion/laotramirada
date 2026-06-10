import { Link } from "react-router-dom";

export const logoImage = "/brand/logo-la-otra-mirada-blanco-transparente.webp";

export function Logo() {
  return (
    <Link className="lom-logo" to="/" aria-label="La Otra Mirada">
      <img src={logoImage} alt="" />
    </Link>
  );
}
