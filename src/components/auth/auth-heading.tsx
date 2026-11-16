type AuthHeadingProps = { title: string; description: string }

export function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold text-balance text-ink sm:text-4xl">{title}</h1>
      <p className="mt-2 text-ink/65">{description}</p>
    </div>
  )
}
