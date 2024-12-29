import '@/styles/globals.sass'
import styles from '@/components/project-deck/deck.module.sass'
import Image from "next/image";
import ImageDTC from '@/images/dtc.jpg'
import ImageFBLA from '@/images/fblaProject22.jpg'
import ImageIG from '@/Images/instagram.jpg'

export default function ProjectDeck() {
  return (
    <div className={styles.deck}>
      <div className={styles.tile}
           style={{
             backgroundColor: 'rgb(67, 37, 52)',
           }}>
        <Image src={ImageFBLA} alt={"Future Business Leaders of America 2021/22 Competition - Website Design."}></Image>
        <a className="btn"
           // onClick={() => openModal('project', '0')}
           style={{color: 'rgb(196, 73, 0)'}}
          >Learn More</a>
      </div>
      <div className={styles.tile}
           style={{
             backgroundColor: 'rgb(200, 55, 171)',
           }}>
        <Image src={ImageIG} alt={"Instagram logo with the word 'posts' on its right."}></Image>
        <a className="btn"
           // onClick={() => openModal('project', '1')}
           style={{color: 'rgb(55, 113, 200)'}}
          >Learn More</a>
      </div>
      <div className={styles.tile}
           style={{
             backgroundColor: 'rgb(166, 15, 45)'
           }}>
        <Image src={ImageDTC} alt={"WSU Logo with the letters DTC, which stands for Digital Technology and Culture."}></Image>
        <a className="btn"
           // onClick={() => openModal('project', '2')}
           style={{color: 'rgb(77, 77, 77)'}}
        >Learn More</a>
      </div>
    </div>
  )
}