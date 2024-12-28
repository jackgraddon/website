import '@/styles/globals.sass'
import styles from '@/components/project-deck/deck.module.sass'

export default function ProjectDeck() {
  return (
    <div className={styles.deck}>
      <div className={styles.tile}
           style={{
             backgroundImage: `url('./projects/web/fbla/2022/preview.jpg')`,
             backgroundColor: 'rgb(67, 37, 52)',
           }}
           aria-label="Future Business Leaders of America 2021/22 Competition - Website Design.">
        <a className="btn"
           // onClick={() => openModal('project', '0')}
           style={{color: 'rgb(196, 73, 0)'}}
          >Learn More</a>
      </div>
      <div className={styles.tile}
           style={{
             backgroundImage: `url('./projects/design/instagram/preview.jpg')`,
             backgroundColor: 'rgb(200, 55, 171)',
           }}
           aria-label="Instagram logo with the word 'posts' on its right.">
        <a className="btn"
           // onClick={() => openModal('project', '1')}
           style={{color: 'rgb(55, 113, 200)'}}
          >Learn More</a>
      </div>
      <div className={styles.tile}
           style={{
             backgroundImage: `url('./projects/design/dtc/preview.jpg')`,
             backgroundColor: 'rgb(166, 15, 45)'
           }}
           aria-label="WSU Logo with the letters DTC, which stands for Digital Technology and Culture.">
        <a className="btn"
           // onClick={() => openModal('project', '2')}
           style={{color: 'rgb(77, 77, 77)'}}
        >Learn More</a>
      </div>
    </div>
  )
}