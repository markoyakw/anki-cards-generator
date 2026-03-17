import type { CSSProperties, FC } from "react";
import classes from "./MyLink.module.css"
import "@assets/styles/animations.css"

type TMyLinkProps = {
    href: string
    newTab?: boolean
    children: string
};

const MyLink: FC<TMyLinkProps> = ({ href, newTab, children }) => {
    const target = newTab ? "_blank" : "_self";

    return (
        <a
            href={href}
            rel="noopener noreferrer"
            className={classes["link"]}
            target={target}
        >
            {children.split("").map((char, index) => (
                <span
                    key={index}
                    style={{
                        "--index": index,
                        "animation": "color-change 7s infinite calc((var(--index) * 0.02s)) linear"
                    } as CSSProperties}
                    className={classes["link__letter"]}
                >
                    {char}
                </span>
            ))}
        </a>
    );
};

export default MyLink;