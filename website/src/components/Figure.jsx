export default function Figure({ src, caption, label, scale = 1 }) {
    const maxWidth = Math.min(scale * 100, 100)
    return (
        <figure className="figure" id={label}>
            <img
                src={src}
                alt={caption}
                style={{ maxWidth: `${maxWidth}%` }}
                loading="lazy"
            />
            {caption && <figcaption className="figure-caption">{caption}</figcaption>}
        </figure>
    )
}
