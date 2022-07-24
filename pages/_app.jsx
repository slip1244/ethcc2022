import project from "../config/project.json"
import style from "../config/style.json"
import Layout from "../components/Layout.jsx"
import Head from "next/head"
import Error from "next/error"
import { useState, useEffect } from "react"
import { CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'


const Metadata = () => {
	return (
		<Head>
			<meta charSet="UTF-8"></meta>
			<meta name="viewport" content="width=device-width"></meta>
			<meta name="description" content={project.desc}></meta>
			<meta property="og:title" content={project.name}></meta>
			<meta property="og:type" content="website"></meta>
			<meta property="og:image" content={`https://gateway.pinata.cloud/ipfs/QmeN4Rfxxof5dhKVaw1xSzJNjENq9YquxJuFej4svf7thL`}></meta>
			<meta property="og:description" content={project.desc}></meta>

			{/* <meta name="twitter:card" content="summary"></meta>
			<meta name="twitter:site" content={project.twitter}></meta>
			<meta name="twitter:title" content={project.name}></meta>
			<meta name="twitter:description" content={project.desc}></meta>
			<meta name="twitter:image" content={`https://${project.domain}${project.logo}`}></meta>
			<meta name="twitter:creator" content={project.twitter}></meta> */}

			<title>{project.name}</title>
			<link rel="icon" href="https://gateway.pinata.cloud/ipfs/QmWMDGk9RVfiSSkXtVMUUXE6omeVN8Q9eaQXo2pTPQ5MGf"></link>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
			{Object.keys(style.fonts).filter(f => style.fonts[f] == "GOOGLE").map((font) => 
				(
					<>
						<link rel="preconnect" href="https://fonts.googleapis.com"></link>
						<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
						<link href={`https://fonts.googleapis.com/css2?family=${font}:wght@300;400;500;600;700;900&display=swap`} rel="stylesheet"></link>
					</>
				)
			)}

		</Head>
	)
}

const App = ({ Component, pageProps }) => {
	const [theme, setTheme] = useState("light")

	useEffect(() => {
		if (!localStorage.theme) {
			localStorage.theme = theme
		}
		setTheme(localStorage.theme)
	}, [])

	useEffect(() => {
		localStorage.theme = theme
	}, [theme])


	if (pageProps.statusCode) {
		return <Error statusCode={pageProps.statusCode}></Error>
	}

	return (
		<>
			
			<Metadata />
				<Layout theme={theme} setTheme={setTheme}>
					<Component {...pageProps} theme={theme}></Component>
				</Layout>


			<style jsx global>{`
                :root {
                    ${Object.entries(style.colors.raw).map(mapping => `--${mapping[0]}: ${mapping[1]};`).join("")}
                    ${Object.entries(style.colors.elements[theme]).map(mapping => `--${mapping[0]}: var(--${mapping[1]});`).join("")}
                    --border-radius: 12px;
                }

                * {
                    // color: var(--text);
                    box-sizing: border-box;
					scrollbar-color: var(--accent);
					scrollbar-width: thin;
					line-height: 1em;
					font-family: "${style.bodyFont}";
					transition: 0.2s background cubic-bezier(.16,.35,.35,.86),
						0.2s filter cubic-bezier(.16,.35,.35,.86),
						0.2s color cubic-bezier(.16,.35,.35,.86),
						0.1s opacity cubic-bezier(.16,.35,.35,.86);
                }

                body {
                    margin: 0;
                    background-color: var(--bg);
                }

				${Object.keys(style.fonts).filter(f => style.fonts[f] !== "GOOGLE").map(f => {
					return Object.keys(style.fonts[f]).map(weight => {
						return `
							@font-face {
								font-family: "${f}";
								src: url("/fonts/${style.fonts[f][weight]}") format("${style.fonts[f][weight].split(".")[1] == "ttf" ? "truetype" : style.fonts[f][weight].split(".")[1]}");
								font-weight: ${weight};
							}
						`
					}).join("\n")
				}).join("\n")}

				.title {
					font-family: "${style.titleFont}"
				}

                a {
                    text-decoration: initial;
                    cursor: pointer;
                }

				a.inactive {
					color: var(--text-gray);
				}

				input {
					border: none;
					background-color: transparent;
				}

                button, .button {
                    cursor: pointer;
                    padding: 0;
                    border-radius: var(--border-radius);
                    border: 2px solid transparent;
					text-align: center;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-weight: 500;
                }

				.button.disabled, button.disabled {
					opacity: 0.8;
					pointer-events: none;
				}

                .button.primary, button.primary {
                    color: var(--white);
                    background-color: var(--accent);
					border-color: var(--accent);
                }

                .button.secondary, button.secondary {
                    color: var(--text);
					background: linear-gradient(var(--bg), var(--bg)) padding-box,
						linear-gradient(to bottom right, var(--accent), var(--accent-alt)) border-box;
                }

				.button.secondary:hover, button.secondary:hover {
					filter: brightness(1.1);
				}

				.button.tertiary, button.tertiary {
					color: var(--white);
					background: linear-gradient(to bottom right, var(--accent), var(--accent-alt)) padding-box,
						linear-gradient(to bottom right, var(--accent), var(--accent-alt)) border-box;
				}

				.button.tertiary:hover, button.tertiary:hover {
					filter: brightness(1.1);
				}

				.button.small, button.small {
					font-size: 1em;
					padding: 8px 16px;
				}

				.card {
					background-color: var(--bg-alt);
					border-radius: var(--border-radius);
					border: 1px solid var(--border-color);
				}

                .rounded {
                    border-radius: var(--border-radius);
                }

                .bordered {
                    border: 1px solid var(--border-color);
                }

                .row {
                    display: flex;
                    flex-direction: row;
                }

                .col {
                    display: flex;
                    flex-direction: column;
                }

                .center-m {
                    justify-content: center;
                }

                .center-a {
                    align-items: center;
                }

                .evenly {
                    justify-content: space-evenly;
                }

                .between {
                    justify-content: space-between;
                }

				.underline {
					text-decoration: underline;
				}

				.patterned {
					// background-image: 
				}

				::-webkit-scrollbar {
					width: 10px;
					height: 10px;
				}

				::-webkit-scrollbar-track {
					background: transparent;
				}

				::-webkit-scrollbar-thumb {
					background: var(--accent);
					filter: saturate(0.8);
					transition: 0.2s background;
					border-radius: 999px;
					width: 4px;
					height: 4px;
					border: 3px solid rgba(0,0,0,0);
					background-clip: padding-box;
				}

				::-webkit-scrollbar-corner {
					background: rgba(0,0,0,0);
				}
            `}</style>
		</>
	)
}

export default App