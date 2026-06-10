type PageHeroProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  image?: string;
};

export function PageHero({ title, eyebrow, description, image }: PageHeroProps) {
  return (
    <section
      className="page-hero"
      style={
        image
          ? {
              backgroundImage: `linear-gradient(90deg, rgba(16,16,16,.82), rgba(16,16,16,.3)), url(${image})`,
            }
          : undefined
      }
    >
      <div className="lom-shell-wide">
        {eyebrow && <p className="lom-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  );
}
