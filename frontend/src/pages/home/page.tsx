import styles from "./page.module.css"
import FrogWizardImage from "@/assets/imgs/QB_Froggo_Wizard.png"
import Sparkle from "@/assets/svgs/sparkle.svg?react"
import SmallSparkle from "@/assets/svgs/small-sparkle.svg?react"
import MediumSparkle from "@/assets/svgs/medium-sparkle.svg?react"
import LargeSparkle from "@/assets/svgs/large-sparkle.svg?react"
import { CircleX, FolderGit2, PartyPopper, Send } from "lucide-react"
import { useState } from "react"

function Home() {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  const sendMessage = async () => {
    setErrorMessage("")
    setSuccessMessage("")
    if (!message) {
      setErrorMessage("Please write a message.")
      return
    }
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Unable to send message.")
      }
      console.log(data.message)
      handleMessageSent()
    } catch (error) {
      console.error("Failed to send message: ", error)
    }
  }

  const handleMessageSent = () => {
    setName("")
    setEmail("")
    setMessage("")
    setSuccessMessage("Message Sent!")
  }

  return (
    <div className={styles.home_page}>
      <section className={styles.hero}>
        <div className={styles.hero_text_cont}>
          <SmallSparkle className={styles.small_sparkle_1}/>
          <MediumSparkle className={styles.medium_sparkle_1}/>
          <LargeSparkle className={styles.large_sparkle_1}/>
          <SmallSparkle className={styles.small_sparkle_2}/>
          <MediumSparkle className={styles.medium_sparkle_2}/>
          <h1>Org<span>a</span>nize Every <span className={styles.green_text}>ADVENTURE</span>.</h1>
          <p>QuestBase keeps your campaigns, quests, NPCs, and session notes together so you're always ready for game night!</p>
          <div className={styles.sparkle_button}>
            <Sparkle className={styles.sparkle_icon} />
            <p>Learn more</p>
          </div>
        </div>
        <div className={styles.hero_image_cont}>
          <img 
            src={FrogWizardImage} 
            alt="Illustration of a cute frog wizard holding a stick wand glowing pink and a tadpole egg with a purple aura around him with three tadpoles floating in it."
            className={styles.hero_image}
          />
        </div>
      </section>
      <section id="contact" className={styles.contact}>
        <div className={styles.contact_text_container}>
          <div className={styles.contact_text}>
            <h1>Contact <span>Us</span></h1>
            <p>Have a <span>question</span>, found a <span>bug</span>, or have an <span>ideas</span> for QuestBase?</p>
            <p>We'd love to hear from you. Feel free to reach out anytime at{" "}<a href="mailto:support@questbase.net">support@questbase.net</a></p>
          </div>
          <div className={styles.project_link}>
            <FolderGit2 color={"var(--qb-alien-green)"} size={25}></FolderGit2>
            <p><a href="https://github.com/Cthomp7/QuestBase" target="_blank">https://github.com/Cthomp7/QuestBase</a></p>
          </div>
        </div>
        <div className={styles.contact_form_container}>
          <p>Name</p>
          <input 
            type="text"
            name="name"
            className={styles.dark_input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ribbert Muddles"
          />
          <p>Email</p>
          <input
            type="text"
            name="email"
            className={styles.dark_input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ribbert@wobblewizards.com"
          />
          <p>Message</p>
          <textarea 
            name="form-message" 
            className={styles.dark_input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Explain your quest, bug, or brilliant idea..."
          ></textarea>
          <div className={styles.button_error_container}>
            <div 
              className={styles.green_button}
              onClick={sendMessage}
            >
              <Send></Send>
              <p>Send</p>
            </div>
            {errorMessage && 
              <div className={`${styles.message} ${styles.error_message}`}>
                <CircleX color={"#ff5d5d"} size={25}/>
                <p>{errorMessage}</p>
              </div>
            }
            {successMessage && 
              <div className={`${styles.message} ${styles.success_message}`}>
                <PartyPopper color={"var(--qb-alien-green)"} size={25}/>
                <p>{successMessage}</p>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
