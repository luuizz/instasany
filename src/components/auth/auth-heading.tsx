type AuthHeadingProps = { title: string; description: string }

export function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-ink/60">{description}</p>
    </div>
  )
}
