import { motion } from 'framer-motion'

const apkDownloadUrl = 'https://example.com/gamedex.apk'
const repositoryUrl = 'https://github.com/dudumiranda3105/GameDex'

const appBenefits = [
  'Acesso offline aos seus jogos favoritos',
  'Notificações de novos lançamentos',
  'Interface otimizada para mobile',
  'Sincronização com sua conta',
]

const appRequirements = [
  'Android 8+',
  'Conexão para sincronização inicial',
  'Aproximadamente 120MB de espaço livre',
]

function DownloadPage() {
  const hasValidApkUrl = apkDownloadUrl.includes('expo.dev') || apkDownloadUrl.includes('.apk')

  return (
    <section className="content-page download-page">
      <motion.div
        className="title-block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Baixe o App GameDex</h1>
        <p>
          Leve sua experiência gamer para o próximo nível com o aplicativo mobile oficial do GameDex.
        </p>
      </motion.div>

      <motion.div
        className="section-panel download-features"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2>Recursos do App</h2>
        <p className="download-subtext">
          O app foi desenhado para consulta rápida, descoberta de jogos e organização da sua lista pessoal em qualquer lugar.
        </p>
        <ul>
          {appBenefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="section-panel download-requirements"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16 }}
      >
        <h2>Compatibilidade</h2>
        <ul>
          {appRequirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="download-actions section-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22 }}
      >
        <h2>Baixe agora</h2>
        <p className="download-subtext">
          Faça o download da versão APK ou acesse o repositório do app.
        </p>
        {!hasValidApkUrl && (
          <p className="download-warning">
            O link do APK ainda está em modo de exemplo. Atualize a constante apkDownloadUrl com a URL gerada pelo EAS Build.
          </p>
        )}
        <div className="actions-row">
          <motion.a
            href={apkDownloadUrl}
            className="primary-btn"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Baixar APK direto
          </motion.a>
          <motion.a
            href={repositoryUrl}
            className="secondary-btn"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver código no GitHub
          </motion.a>
        </div>
      </motion.div>

      <motion.div
        className="section-panel download-note"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2>Notas da versão</h2>
        <p>
          Versão atual com busca por jogos, detalhes completos e visual otimizado para mobile.
        </p>
      </motion.div>
    </section>
  )
}

export default DownloadPage
