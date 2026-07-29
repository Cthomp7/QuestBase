import styles from "./page.module.css"
import FrogWizardImage from "@/assets/imgs/QB_Froggo_Wizard.png"
import Sparkle from "@/assets/svgs/sparkle.svg?react"
import SmallSparkle from "@/assets/svgs/small-sparkle.svg?react"
import MediumSparkle from "@/assets/svgs/medium-sparkle.svg?react"
import LargeSparkle from "@/assets/svgs/large-sparkle.svg?react"

function Home() {

  return (
    <div>
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
    </div>
  );
}

export default Home;
