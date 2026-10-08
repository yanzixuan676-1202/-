import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import BorderGlow from './components/BorderGlow'
import RippleDistortion from './components/RippleDistortion'
import './styles.css'

const projects = [
  ['01', '万物 IOE 健康监测', 'SMART MONITORING · UI SYSTEM'],
  ['02', '浙农员工餐厅', 'MINI PROGRAM · PRODUCT'],
  ['03', '亚运电信 H5', 'INTERACTION · H5 EXPERIENCE'],
  ['04', '健康大作战', 'HEALTH · DIGITAL CAMPAIGN'],
  ['05', '官网首页', 'WEB · UI DESIGN'],
  ['06', '千问 AI 眼镜', 'AI PRODUCT · UI / VISUAL'],
  ['07', '天猫精灵活动视觉', 'CAMPAIGN · DIGITAL VISUAL'],
]

const projectRailItems = [...projects, ...projects]

const projectDetails = {
  '01': { title: '万物 IOE 健康监测', image: '/images/project-ioe-monitoring.png', aspectRatio: '1920 / 29400' },
  '02': { title: '浙农员工餐厅', image: '/images/project-zhejiang-agri-canteen.png', aspectRatio: '1920 / 26196' },
  '03': { title: '亚运电信 H5', image: '/images/project-asian-games-h5.png', aspectRatio: '1920 / 12985' },
  '04': { title: '健康大作战', image: '/images/project-health-battle.png', aspectRatio: '1920 / 12064' },
  '05': { title: '官网首页', image: '/images/project-homepage.png', aspectRatio: '1920 / 31832' },
  '06': { title: '千问 AI 眼镜' },
  '07': { title: '天猫精灵活动视觉' },
}

const getProjectIdFromHash = () => window.location.hash.match(/^#project-(0[1-7])$/)?.[1] ?? null

const strengths = [
  ['Product Experience', '用户流程 / 信息架构 / 交互 / 原型'],
  ['UI System', '视觉规范 / Design System / Components / Responsive'],
  ['AI Product', 'AI Workflow / Agent / Generative UI / AI Interaction'],
  ['Delivery', 'Prototype / Motion / Dev Handoff / QA / Multi-platform'],
]

const experience = [
  ['2024.06 — 2026.10', '仁励家网络科技有限公司', '视觉设计 / UI（阿里项目）', '负责千问 AI 眼镜、天猫精灵相关活动页面及部分业务 UI 设计，覆盖信息架构、视觉规范、适配与上线。'],
  ['2023.02 — 2024.06', '浙江金色年华养老产业集团有限公司', 'UI 主设', '负责AI老人看护产品从0到1的移动端小程序及官网设计，覆盖信息架构、核心流程、原型、规范和开发交付。'],
  ['2021.09 — 2023.02', '浙江仙风智能科技有限公司', 'UI 实习 — UI 设计', '参与 App、小程序、互动 H5 和游戏平台的需求分析、原型及高保真设计，并参与动效与开发交付。'],
]

const honours = [
  ['第十六届全国数字艺术设计大赛', '三等奖'],
  ['2020年安徽省大学生生物标本制作大赛', '二等奖'],
  ['2020安徽省大学生环境设计大赛', '二等奖'],
  ['2022年本科优秀毕业设计', '一等奖'],
  ['第三届奇思妙想协同大赛', '一等奖'],
  ['第四届奇思妙想协同合作创作大赛', '一等奖'],
  ['2019–2020学习进步奖', ''],
  ['全国计算机等级二级', ''],
]

const formatCurrentTime = () => new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
}).format(new Date())

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [projectMenuOpen, setProjectMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(formatCurrentTime)
  const [phonePreviewOpen, setPhonePreviewOpen] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(() => window.location.hash === '#resume')
  const [activeProject, setActiveProject] = useState(getProjectIdFromHash)
  const projectRailRef = useRef(null)
  const projectDragRef = useRef(null)
  const projectAutoPauseRef = useRef(false)

  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      })
    }, { threshold: .14 })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const refreshTime = () => setCurrentTime(formatCurrentTime())
    const timer = window.setInterval(refreshTime, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const syncDetailRoute = () => {
      setResumeOpen(window.location.hash === '#resume')
      setActiveProject(getProjectIdFromHash())
    }
    window.addEventListener('hashchange', syncDetailRoute)
    return () => window.removeEventListener('hashchange', syncDetailRoute)
  }, [])

  useEffect(() => {
    if (!projectMenuOpen) return undefined
    const closeProjectMenu = (event) => {
      if (event.key === 'Escape') {
        setProjectMenuOpen(false)
        return
      }
      if (event.type === 'pointerdown' && !event.target.closest?.('.nav-project-control') && !event.target.closest?.('.mobile-menu')) setProjectMenuOpen(false)
    }
    window.addEventListener('keydown', closeProjectMenu)
    window.addEventListener('pointerdown', closeProjectMenu)
    return () => {
      window.removeEventListener('keydown', closeProjectMenu)
      window.removeEventListener('pointerdown', closeProjectMenu)
    }
  }, [projectMenuOpen])

  useEffect(() => {
    if (!resumeOpen && !activeProject) return undefined
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') window.history.back()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [resumeOpen, activeProject])

  useEffect(() => {
    const rail = projectRailRef.current
    if (!rail || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined

    let frame = 0
    let previousTime = performance.now()
    const moveRail = (now) => {
      const elapsed = Math.min(64, now - previousTime)
      previousTime = now
      const firstCard = rail.querySelector('[data-gallery-set="primary"]')
      const duplicateCard = rail.querySelector('[data-gallery-set="duplicate"]')
      const loopWidth = duplicateCard && firstCard ? duplicateCard.offsetLeft - firstCard.offsetLeft : 0

      if (!projectAutoPauseRef.current && loopWidth > 0) {
        rail.scrollLeft += elapsed * 0.018
        if (rail.scrollLeft >= loopWidth) rail.scrollLeft -= loopWidth
      }
      frame = window.requestAnimationFrame(moveRail)
    }
    frame = window.requestAnimationFrame(moveRail)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const scrollTo = (id) => {
    setMenuOpen(false)
    setProjectMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleProjectMenu = (keepMobileMenu = false) => {
    if (!keepMobileMenu) setMenuOpen(false)
    document.getElementById('top')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setProjectMenuOpen((isOpen) => !isOpen)
  }

  const openResume = () => {
    setPhonePreviewOpen(false)
    if (window.location.hash !== '#resume') window.location.hash = 'resume'
    else setResumeOpen(true)
  }

  const closeResume = () => {
    if (window.location.hash === '#resume' && window.history.length > 1) window.history.back()
    else {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      setResumeOpen(false)
    }
  }

  const openProject = (projectId) => {
    pauseProjectRail()
    setProjectMenuOpen(false)
    const projectHash = `#project-${projectId}`
    if (window.location.hash !== projectHash) window.location.hash = `project-${projectId}`
    else setActiveProject(projectId)
  }

  const closeProject = () => {
    if (/^#project-0[1-7]$/.test(window.location.hash) && window.history.length > 1) window.history.back()
    else {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      setActiveProject(null)
    }
  }

  const startProjectDrag = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const rail = projectRailRef.current
    if (!rail) return
    projectAutoPauseRef.current = true
    const captureTarget = event.target.closest?.('.project-link') ?? rail
    projectDragRef.current = { startX: event.clientX, startScroll: rail.scrollLeft, captureTarget, pointerId: event.pointerId }
    captureTarget.setPointerCapture?.(event.pointerId)
  }

  const moveProjectDrag = (event) => {
    const rail = projectRailRef.current
    const drag = projectDragRef.current
    if (!rail || !drag) return
    const distance = event.clientX - drag.startX
    if (Math.abs(distance) > 3) rail.dataset.dragging = 'true'
    rail.scrollLeft = drag.startScroll - distance
  }

  const stopProjectDrag = () => {
    const rail = projectRailRef.current
    const drag = projectDragRef.current
    if (drag?.captureTarget?.hasPointerCapture?.(drag.pointerId)) drag.captureTarget.releasePointerCapture(drag.pointerId)
    projectDragRef.current = null
    if (rail) delete rail.dataset.dragging
  }

  const pauseProjectRail = () => {
    projectAutoPauseRef.current = true
  }

  const resumeProjectRail = () => {
    projectAutoPauseRef.current = false
  }

  const scrollProjectRail = (event) => {
    const rail = projectRailRef.current
    if (!rail || rail.scrollWidth <= rail.clientWidth || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    event.preventDefault()
    rail.scrollLeft += event.deltaY
  }

  const [hours, minutes] = currentTime.split(':')

  return (
    <main>
      <nav className="nav" aria-label="主导航">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="回到首页">YAN<span>.</span></button>
        <div className="nav-links">
          <div className="nav-project-control">
            <button className="nav-project-toggle" onClick={toggleProjectMenu} aria-expanded={projectMenuOpen} aria-controls="project-menu">精选项目 <span aria-hidden="true">⌄</span></button>
            {projectMenuOpen && <div className="project-menu" id="project-menu" role="menu" aria-label="作品集目录">
              {projects.map(([number, title]) => <button key={number} type="button" role="menuitem" onClick={() => openProject(number)}><span>CASE / {number}</span><strong>{title}</strong><i aria-hidden="true">↗</i></button>)}
            </div>}
          </div>
          <button onClick={() => scrollTo('about')}>关于我</button>
          <button onClick={() => scrollTo('strengths')}>核心能力</button>
          <button onClick={() => scrollTo('experience')}>工作经历</button>
        </div>
        <button className="nav-contact" onClick={() => scrollTo('contact')}>联系我 <img src="/images/contact-smile.svg" alt="" /></button>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-label="打开导航" onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
      </nav>

      {menuOpen && <div className="mobile-menu">
        <button className="mobile-project-toggle" onClick={() => toggleProjectMenu(true)} aria-expanded={projectMenuOpen}>精选项目 <span aria-hidden="true">⌄</span></button>
        {projectMenuOpen && <div className="mobile-project-menu" aria-label="作品集目录">
          {projects.map(([number, title]) => <button key={number} type="button" onClick={() => openProject(number)}><span>CASE / {number}</span>{title}</button>)}
        </div>}
        <button onClick={() => scrollTo('about')}>关于我</button>
        <button onClick={() => scrollTo('strengths')}>核心能力</button>
        <button onClick={() => scrollTo('experience')}>工作经历</button>
        <button onClick={() => scrollTo('contact')}>联系我</button>
      </div>}

      <section className="hero" id="top">
        <RippleDistortion
          className="hero-video hero-ripple"
          src="/images/hero-imac-video-stage.png"
          brushSize={54}
          strength={0.055}
          swirl={0.32}
          rings={2}
          spread={2.2}
          fade={1.15}
          spacing={34}
          glint={0.025}
          tint="#5dafff"
          tintAmount={0.035}
          trigger="hover"
          quality="low"
        />
        <div className="hero-media-stage" aria-hidden="true">
          <RippleDistortion
            className="imac-screen-video"
            videoSrc="/videos/hero-imac-loop.mov"
            brushSize={26}
            strength={0.045}
            swirl={0.24}
            rings={2}
            spread={1.9}
            fade={.9}
            spacing={18}
            glint={0.018}
            tint="#75b8ff"
            tintAmount={0.025}
            trigger="hover"
            quality="medium"
          />
        </div>
        <div className="hero-veil" />
        <time className="desk-clock" aria-label={`当前时间 ${currentTime}`}>
          <span>{hours}</span><span className="clock-colon">:</span><span>{minutes}</span>
        </time>
        <div
          className={`phone-preview-trigger ${phonePreviewOpen ? 'is-open' : ''}`}
          onMouseEnter={() => setPhonePreviewOpen(true)}
          onMouseLeave={() => setPhonePreviewOpen(false)}
        >
          <button
            className="phone-hotspot"
            type="button"
            aria-label="查看移动端简历预览"
            aria-expanded={phonePreviewOpen}
            onFocus={() => setPhonePreviewOpen(true)}
            onBlur={() => setPhonePreviewOpen(false)}
            onClick={openResume}
          />
          <figure className="resume-preview" aria-hidden={!phonePreviewOpen} onClick={openResume}>
            <img src="/images/mobile-resume-preview.png" alt="严孜旋移动端简历预览" />
          </figure>
        </div>
        <div className="hero-copy">
          <p className="hero-mark">严孜旋 / UI 设计师</p>
          <h1 aria-label="2026 设计作品集"><span>2026</span><em>设计作品集</em></h1>
          <div className="hero-stat"><strong>05<span>+</span></strong><p>YEARS OF<br />DIGITAL EXPERIENCE</p></div>
        </div>
        <div className="hero-projects" id="portfolio" aria-label="作品集入口">
          <p>PORTFOLIO INDEX / CASE STUDIES</p>
          <div
            className="project-index"
            ref={projectRailRef}
            onPointerDown={startProjectDrag}
            onPointerMove={moveProjectDrag}
            onPointerUp={stopProjectDrag}
            onPointerCancel={stopProjectDrag}
            onPointerEnter={pauseProjectRail}
            onPointerLeave={resumeProjectRail}
            onWheel={scrollProjectRail}
          >
            {projectRailItems.map(([number, title, type], index) => {
              const isDuplicate = index >= projects.length
              const hasProjectDetail = Boolean(projectDetails[number])
              return <BorderGlow className="project-link" key={`${number}-${index}`} data-index={number} data-gallery-set={isDuplicate ? 'duplicate' : 'primary'} aria-hidden={isDuplicate} tabIndex={isDuplicate ? -1 : undefined} aria-label={hasProjectDetail ? `查看${title}项目详情` : `${title}，作品详情即将上线`} onClick={hasProjectDetail ? () => openProject(number) : pauseProjectRail}>
                <span>CASE / {number}</span><strong>{title}</strong><small>{type}</small>
              </BorderGlow>
            })}
          </div>
        </div>
      </section>

      <section className="section about" id="about">
        <div className="section-label" data-reveal><span>01</span> / PROFILE</div>
        <div className="about-grid" data-reveal>
          <div className="profile-visual" aria-label="严孜旋个人档案"><span>YZ</span><small>VISUAL / AI / UI</small></div>
          <div className="about-copy">
            <p className="kicker">ABOUT ME</p>
            <h2>用视觉与系统<br />推动<span>清晰体验</span></h2>
            <p className="intro">5年UI与视觉设计经验，具备多端需求分析、交互设计、视觉规范与开发交付能力。擅长搭建AI辅助设计流程，通过结构化Prompt、Agent任务编排与人工校准，提升设计效率与方案质量。</p>
            <div className="contact-line"><a href="mailto:2418640976@qq.com">2418640976@qq.com</a><a href="tel:18725524303">187 2552 4303</a></div>
            <div className="metrics"><div><strong>05<span>+</span></strong><p>YEARS EXPERIENCE</p></div><div><strong>20<span>+</span></strong><p>PRODUCTS / PROJECTS</p></div><div><strong>07</strong><p>SELECTED CASES</p></div></div>
          </div>
        </div>
      </section>

      <section className="section strengths" id="strengths">
        <div className="section-label" data-reveal><span>02</span> / EXPERTISE</div>
        <div className="section-heading" data-reveal><h2>核心<br /><em>能力</em></h2><p>从策略梳理到视觉落地，用完整的设计视角建立可持续的数字体验。</p></div>
        <div className="strength-grid">
          {strengths.map(([title, text]) => <BorderGlow className="strength-card" data-reveal key={title} aria-label={title}><h3>{title}</h3><p>{text}</p></BorderGlow>)}
        </div>
      </section>

      <section className="section experience" id="experience">
        <div className="section-label" data-reveal><span>03</span> / EXPERIENCE</div>
        <div className="section-heading" data-reveal><h2>工作<br /><em>经历</em></h2><p>在产品、活动视觉与 AI 应用场景中持续累积的真实项目经验。</p></div>
        <div className="experience-list">
          {experience.map(([time, company, role, text]) => <article className="experience-item" data-reveal key={time}><time>{time}</time><div><h3>{company}</h3><p className="role">{role}</p><p>{text}</p></div></article>)}
        </div>
      </section>

      <section className="section credentials">
        <div className="section-label" data-reveal><span>04</span> / CREDENTIALS</div>
        <div className="credentials-grid" data-reveal><div><p className="kicker">EDUCATION</p><h2>安徽农业大学<br />经济技术学院</h2><p>2018.09 — 2022.07 / 本科</p></div><div><p className="kicker">HONOURS</p><ul>{honours.map(([name, prize]) => <li key={name}><span>{name}</span>{prize && <b>{prize}</b>}</li>)}</ul></div></div>
      </section>

      <section className="contact" id="contact">
        <div><p className="kicker">LET'S WORK TOGETHER</p><h2>让下一个体验<br /><em>更有分量。</em></h2><a className="mail" href="mailto:2418640976@qq.com">2418640976@qq.com <span>↗</span></a><p className="contact-foot">HANGZHOU, CHINA · AVAILABLE FOR DESIGN COLLABORATION</p></div>
      </section>

      {resumeOpen && <section className="resume-page" role="dialog" aria-modal="true" aria-label="严孜旋完整简历">
        <header className="resume-page-header">
          <p>严孜旋 / UI 设计师</p>
          <button type="button" onClick={closeResume} aria-label="关闭简历预览">关闭 <span>×</span></button>
        </header>
        <img src="/images/resume-full-preview-pdf.png" alt="严孜旋完整个人简历" />
      </section>}

      {activeProject && <section className="project-page" role="dialog" aria-modal="true" aria-label={`${projectDetails[activeProject].title}项目详情`}>
        <header className="project-page-header">
          <p>{projectDetails[activeProject].title} / CASE {activeProject}</p>
          <button type="button" onClick={closeProject} aria-label="返回作品集">返回作品集 <span>×</span></button>
        </header>
        {projectDetails[activeProject].image ? <>
          <div className="project-page-art" role="img" aria-label={`${projectDetails[activeProject].title}项目详情`} style={{ aspectRatio: projectDetails[activeProject].aspectRatio }} />
          <RippleDistortion
            className="project-page-ripple"
            src={projectDetails[activeProject].image}
            viewportCrop
            scrollContainerSelector=".project-page"
            brushSize={54}
            strength={0.055}
            swirl={0.32}
            rings={2}
            spread={2.2}
            fade={1.15}
            spacing={34}
            glint={0.025}
            tint="#5dafff"
            tintAmount={0.035}
            trigger="hover"
            quality="low"
          />
        </> : <div className="project-page-placeholder"><p>CASE / {activeProject}</p><h1>{projectDetails[activeProject].title}</h1><span>PROJECT DETAILS / COMING SOON</span></div>}
      </section>}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
