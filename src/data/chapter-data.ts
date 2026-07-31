/**
 * 知识点卡片数据类型定义
 */

export interface ContentBlock {
  type: 'text' | 'latex' | 'image' | 'question' | 'animation'
  value: string
}

export interface KnowledgeCard {
  title?: string
  section?: string
  content: ContentBlock[]
  aiHint?: string
}

export interface ChapterContent {
  chapter: number
  title: string
  description?: string
  outline?: string[]
  cards: KnowledgeCard[]
  exercises?: string[]
}

export const chapterData: Record<number, ChapterContent> = {
  1: {
    chapter: 1,
    title: '信号与系统',
    description: '本章介绍信号与系统的基本概念，包括信号的描述、基本变换、典型信号以及系统的分类与性质。',
    outline: [
      '信号的描述与分类',
      '信号的自变量变换',
      '复指数信号与正弦信号',
      '单位冲激信号和单位阶跃信号',
      '连续时间和离散时间系统',
      '系统的基本性质'
    ],
    cards: [
      {
        title: '信号的描述',
        section: '1.1',
        content: [
          { type: 'text', value: '信号是信息的载体，通常表示为随时间或空间变化的物理量。在数学上，信号可以表示为一个或多个自变量的函数。' },
          { type: 'text', value: '**连续时间信号**：自变量（通常为时间 t）在连续范围内取值的信号，记为 $x(t)$。' },
          { type: 'text', value: '**离散时间信号**：自变量仅在离散时刻取值的信号，记为 $x[n]$，其中 n 为整数。' },
          { type: 'latex', value: 'x(t) = A \\sin(\\omega t + \\phi)' },
          { type: 'question', value: '为什么在数字信号处理中我们使用离散时间信号而不是连续时间信号？' }
        ],
        aiHint: '选中文本，向 AI 提问关于信号描述的问题'
      },
      {
        title: '信号的自变量变换',
        section: '1.2',
        content: [
          { type: 'text', value: '信号的自变量变换包括时移、反转和尺度变换三种基本操作。' },
          { type: 'text', value: '**时移**：$x(t - t_0)$ 表示将信号 $x(t)$ 向右平移 $t_0$（$t_0 > 0$）。' },
          { type: 'text', value: '**反转**：$x(-t)$ 表示将信号 $x(t)$ 关于纵轴反转。' },
          { type: 'text', value: '**尺度变换**：$x(at)$ 表示将信号 $x(t)$ 在时间轴上压缩（$|a| > 1$）或扩展（$|a| < 1$）。' },
          { type: 'latex', value: 'x(at - b) = x\\left(a\\left(t - \\frac{b}{a}\\right)\\right)' },
          { type: 'question', value: '如果 $x(t)$ 是周期信号，$x(2t)$ 的周期是原来的多少倍？' }
        ],
        aiHint: '试试选中公式向 AI 提问'
      },
      {
        title: '复指数信号与正弦信号',
        section: '1.3',
        content: [
          { type: 'text', value: '复指数信号和正弦信号是信号与系统分析中最基本的信号。' },
          { type: 'latex', value: 'x(t) = e^{st} \\quad (s = \\sigma + j\\omega)' },
          { type: 'text', value: '当 $\\sigma = 0$ 时，$e^{j\\omega t}$ 是虚指数信号，与正弦信号通过欧拉公式关联：' },
          { type: 'latex', value: 'e^{j\\omega t} = \\cos(\\omega t) + j\\sin(\\omega t)' },
          { type: 'text', value: '**离散时间复指数**：$x[n] = e^{j\\omega n}$，其周期性要求 $\\omega / 2\\pi$ 为有理数。' },
          { type: 'question', value: '连续时间复指数信号 $e^{j\\omega t}$ 是否总是周期的？离散时间版本呢？' }
        ],
        aiHint: '欧拉公式是信号分析的基础，点击向 AI 深入了解'
      },
      {
        title: '单位冲激信号和单位阶跃信号',
        section: '1.4',
        content: [
          { type: 'text', value: '单位冲激信号 $\\delta(t)$ 和单位阶跃信号 $u(t)$ 是信号与系统分析中两个重要的奇异信号。' },
          { type: 'latex', value: '\\delta(t) = \\begin{cases} \\infty, & t = 0 \\\\ 0, & t \\neq 0 \\end{cases}, \\quad \\int_{-\\infty}^{\\infty} \\delta(t) dt = 1' },
          { type: 'text', value: '**单位阶跃信号**：' },
          { type: 'latex', value: 'u(t) = \\begin{cases} 1, & t > 0 \\\\ 0, & t < 0 \\end{cases}' },
          { type: 'text', value: '冲激信号与阶跃信号的关系：$\\delta(t) = \\frac{du(t)}{dt}$，$u(t) = \\int_{-\\infty}^{t} \\delta(\\tau) d\\tau$。' },
          { type: 'text', value: '**筛选性质**：$\\int_{-\\infty}^{\\infty} x(t)\\delta(t - t_0) dt = x(t_0)$' },
          { type: 'question', value: '为什么冲激信号被称为"广义函数"？它的严格数学定义是什么？' }
        ],
        aiHint: '冲激信号的筛选性质是 LTI 系统分析的基石'
      },
      {
        title: '连续时间和离散时间系统',
        section: '1.5',
        content: [
          { type: 'text', value: '系统是将输入信号变换为输出信号的实体。数学上，系统可以表示为 $y(t) = T\\{x(t)\\}$ 或 $y[n] = T\\{x[n]\\}$。' },
          { type: 'text', value: '**连续时间系统**：输入和输出都是连续时间信号。' },
          { type: 'text', value: '**离散时间系统**：输入和输出都是离散时间信号。' },
          { type: 'text', value: '**互联方式**：级联（串联）、并联、反馈。' },
          { type: 'image', value: '系统互联示意图：级联、并联、反馈连接' }
        ],
        aiHint: '系统的互联方式决定了复杂系统的分析方法'
      },
      {
        title: '系统的基本性质',
        section: '1.6',
        content: [
          { type: 'text', value: '系统的基本性质包括：记忆性、可逆性、因果性、稳定性、时不变性和线性。' },
          { type: 'text', value: '**记忆性**：无记忆系统（如 $y(t) = kx(t)$）和有记忆系统（如 $y(t) = x(t-1)$）。' },
          { type: 'text', value: '**因果性**：输出只依赖于当前和过去的输入。' },
          { type: 'text', value: '**稳定性**（BIBO）：有界输入产生有界输出。' },
          { type: 'text', value: '**时不变性**：输入的时移导致输出的相同时移。' },
          { type: 'text', value: '**线性**：满足叠加性和齐次性。' },
          { type: 'latex', value: 'T\\{a x_1(t) + b x_2(t)\\} = a T\\{x_1(t)\\} + b T\\{x_2(t)\\}' },
          { type: 'question', value: '系统 $y(t) = x(2t)$ 是线性的吗？是时不变的吗？' }
        ],
        aiHint: 'LTI（线性时不变）系统是本课程的核心研究对象'
      }
    ],
    exercises: [
      '1.1 判断下列信号是连续时间还是离散时间信号：(a) $x(t) = e^{-t}u(t)$ (b) $x[n] = \\cos(0.2\\pi n)$',
      '1.2 已知 $x(t)$ 的波形，画出 $x(2-t)$ 的波形。',
      '1.3 判断 $x(t) = \\cos(2\\pi t) + \\sin(3\\pi t)$ 是否为周期信号，若是，求基波周期。',
      '1.4 计算 $\\int_{-\\infty}^{\\infty} e^{-t}\\delta(t-2) dt$。',
      '1.5 判断系统 $y(t) = tx(t)$ 是否为：(a) 线性 (b) 时不变 (c) 因果 (d) 稳定。'
    ]
  },
  2: {
    chapter: 2,
    title: '线性时不变系统',
    description: '本章深入讨论线性时不变（LTI）系统的时域分析方法，包括卷积积分与卷积和、LTI系统的性质以及用微分/差分方程描述的LTI系统。',
    outline: [
      '离散时间LTI系统的卷积和',
      '连续时间LTI系统的卷积积分',
      'LTI系统的性质',
      '用微分方程描述的连续时间LTI系统',
      '用差分方程描述的离散时间LTI系统',
      'LTI系统的方框图表示'
    ],
    cards: [
      {
        title: '离散时间LTI系统的卷积和',
        section: '2.1',
        content: [
          { type: 'text', value: '离散时间LTI系统可以由其单位脉冲响应 $h[n]$ 完全表征。对于任意输入 $x[n]$，输出 $y[n]$ 由卷积和给出：' },
          { type: 'latex', value: 'y[n] = x[n] * h[n] = \\sum_{k=-\\infty}^{\\infty} x[k] h[n-k]' },
          { type: 'text', value: '**推导思路**：将输入信号分解为加权移位的单位脉冲序列之和：' },
          { type: 'latex', value: 'x[n] = \\sum_{k=-\\infty}^{\\infty} x[k] \\delta[n-k]' },
          { type: 'text', value: '利用LTI系统的线性性和时不变性，即可得到卷积和公式。' },
          { type: 'question', value: '卷积和的计算中，如果 $x[n]$ 和 $h[n]$ 都是有限长序列，输出序列的长度是多少？' }
        ],
        aiHint: '卷积和是离散LTI系统分析的基石'
      },
      {
        title: '卷积和的计算方法',
        section: '2.1',
        content: [
          { type: 'text', value: '计算卷积和 $y[n] = \\sum_{k} x[k] h[n-k]$ 的常用方法：' },
          { type: 'text', value: '**1. 图解法**：将 $h[k]$ 反转得到 $h[-k]$，然后平移 $n$ 个单位，计算与 $x[k]$ 的加权和。' },
          { type: 'text', value: '**2. 列表法**：适用于有限长序列，将 $x[n]$ 和 $h[n]$ 排列成表，按对角线求和。' },
          { type: 'text', value: '**3. 解析法**：利用已知的求和公式直接计算。' },
          { type: 'latex', value: '\\text{例：} x[n] = u[n],\\; h[n] = a^n u[n] \\;\\Rightarrow\\; y[n] = \\frac{1-a^{n+1}}{1-a} u[n]' },
          { type: 'question', value: '用图解法计算卷积时，为什么需要将其中一个序列反转？' }
        ],
        aiHint: '掌握多种卷积计算方法有助于理解LTI系统'
      },
      {
        title: '连续时间LTI系统的卷积积分',
        section: '2.2',
        content: [
          { type: 'text', value: '连续时间LTI系统由单位冲激响应 $h(t)$ 完全表征。输出 $y(t)$ 与输入 $x(t)$ 的关系由卷积积分给出：' },
          { type: 'latex', value: 'y(t) = x(t) * h(t) = \\int_{-\\infty}^{\\infty} x(\\tau) h(t-\\tau) d\\tau' },
          { type: 'text', value: '**推导思路**：将连续时间信号分解为加权移位的冲激信号之和：' },
          { type: 'latex', value: 'x(t) = \\int_{-\\infty}^{\\infty} x(\\tau) \\delta(t-\\tau) d\\tau' },
          { type: 'text', value: '利用LTI系统的线性和时不变性，得到卷积积分表达式。' },
          { type: 'question', value: '卷积积分与卷积和在概念上有何异同？' }
        ],
        aiHint: '卷积积分是连续LTI系统分析的核心工具'
      },
      {
        title: '卷积积分的计算与性质',
        section: '2.2',
        content: [
          { type: 'text', value: '卷积积分的计算步骤（图解法）：' },
          { type: 'text', value: '**步骤1**：将 $h(\\tau)$ 反转得到 $h(-\\tau)$。' },
          { type: 'text', value: '**步骤2**：将 $h(-\\tau)$ 平移 $t$ 得到 $h(t-\\tau)$。' },
          { type: 'text', value: '**步骤3**：计算 $x(\\tau)$ 与 $h(t-\\tau)$ 乘积的积分。' },
          { type: 'text', value: '**卷积的代数性质**：交换律、结合律、分配律。' },
          { type: 'latex', value: 'x(t) * h(t) = h(t) * x(t) \\quad \\text{（交换律）}' },
          { type: 'latex', value: '(x(t) * h_1(t)) * h_2(t) = x(t) * (h_1(t) * h_2(t)) \\quad \\text{（结合律）}' },
          { type: 'question', value: '利用卷积的结合律，两个LTI系统级联后的总冲激响应是什么？' }
        ],
        aiHint: '卷积的代数性质简化了复杂LTI系统的分析'
      },
      {
        title: 'LTI系统的性质',
        section: '2.3',
        content: [
          { type: 'text', value: 'LTI系统的性质可以通过其单位冲激响应（或单位脉冲响应）来表征。' },
          { type: 'text', value: '**记忆性**：无记忆LTI系统 $\\iff h(t) = K\\delta(t)$ 或 $h[n] = K\\delta[n]$。' },
          { type: 'text', value: '**因果性**：因果LTI系统 $\\iff h(t) = 0,\\; t<0$ 或 $h[n] = 0,\\; n<0$。' },
          { type: 'text', value: '**稳定性**（BIBO）：稳定LTI系统 $\\iff \\int_{-\\infty}^{\\infty} |h(t)| dt < \\infty$ 或 $\\sum_{n=-\\infty}^{\\infty} |h[n]| < \\infty$。' },
          { type: 'latex', value: '\\text{因果LTI系统：} y(t) = \\int_{-\\infty}^{t} x(\\tau) h(t-\\tau) d\\tau = \\int_{0}^{\\infty} x(t-\\tau) h(\\tau) d\\tau' },
          { type: 'question', value: '一个LTI系统的 $h(t) = e^{-t}u(t)$，该系统是否稳定？是否因果？' }
        ],
        aiHint: '由冲激响应直接判断LTI系统的性质'
      },
      {
        title: 'LTI系统的可逆性',
        section: '2.3',
        content: [
          { type: 'text', value: '如果一个LTI系统是可逆的，则存在一个逆系统，使得原系统与逆系统级联后等效于恒等系统。' },
          { type: 'text', value: '**可逆条件**：存在 $h^{-1}(t)$ 使得 $h(t) * h^{-1}(t) = \\delta(t)$。' },
          { type: 'text', value: '**例**：延时器 $h(t) = \\delta(t - t_0)$ 的逆系统是 $h^{-1}(t) = \\delta(t + t_0)$（超前器）。' },
          { type: 'text', value: '**例**：累加器 $h[n] = u[n]$ 的逆系统是差分器 $h^{-1}[n] = \\delta[n] - \\delta[n-1]$。' },
          { type: 'latex', value: '\\text{累加器：} y[n] = \\sum_{k=-\\infty}^{n} x[k] \\;\\Longleftrightarrow\\; \\text{差分器：} w[n] = y[n] - y[n-1]' },
          { type: 'question', value: '为什么累加器和差分器互为逆系统？请用卷积验证。' }
        ],
        aiHint: '可逆性在通信系统的均衡器中非常重要'
      },
      {
        title: '用微分方程描述的连续时间LTI系统',
        section: '2.4',
        content: [
          { type: 'text', value: '许多连续时间LTI系统可以用线性常系数微分方程描述：' },
          { type: 'latex', value: '\\sum_{k=0}^{N} a_k \\frac{d^k y(t)}{dt^k} = \\sum_{k=0}^{M} b_k \\frac{d^k x(t)}{dt^k}' },
          { type: 'text', value: '**齐次解**：对应齐次方程的通解，由系统自然频率决定。' },
          { type: 'text', value: '**特解**：与输入信号形式相关的特解。' },
          { type: 'text', value: '**初始条件**：对于因果LTI系统，需要 $N$ 个初始条件来确定唯一解。' },
          { type: 'text', value: '**零输入响应 + 零状态响应**：完全响应可分解为零输入响应（由初始状态引起）和零状态响应（由输入引起）之和。' },
          { type: 'question', value: '零输入响应和零状态响应的物理意义分别是什么？' }
        ],
        aiHint: '微分方程是描述连续LTI系统的标准形式'
      },
      {
        title: '用差分方程描述的离散时间LTI系统',
        section: '2.5',
        content: [
          { type: 'text', value: '离散时间LTI系统可以用线性常系数差分方程描述：' },
          { type: 'latex', value: '\\sum_{k=0}^{N} a_k y[n-k] = \\sum_{k=0}^{M} b_k x[n-k]' },
          { type: 'text', value: '**递推求解**：将方程改写为 $y[n]$ 的显式表达式，从前向后递推计算。' },
          { type: 'text', value: '**初始条件**：对于 $N$ 阶差分方程，需要 $N$ 个初始条件。' },
          { type: 'text', value: '**迭代法**：从 $n=0$ 开始，依次计算 $y[0], y[1], y[2], \\ldots$。' },
          { type: 'latex', value: 'y[n] = \\frac{1}{a_0} \\left( \\sum_{k=0}^{M} b_k x[n-k] - \\sum_{k=1}^{N} a_k y[n-k] \\right)' },
          { type: 'question', value: '一阶差分方程 $y[n] - ay[n-1] = x[n]$ 描述的系统，其单位脉冲响应是什么？' }
        ],
        aiHint: '差分方程适合计算机递推求解'
      },
      {
        title: 'LTI系统的方框图表示',
        section: '2.6',
        content: [
          { type: 'text', value: 'LTI系统可以用基本运算单元组成的方框图来表示，这些基本单元包括：' },
          { type: 'text', value: '**加法器**：将两个信号相加。' },
          { type: 'text', value: '**数乘器**：将信号乘以常数。' },
          { type: 'text', value: '**积分器（连续）**：$\\int_{-\\infty}^{t} x(\\tau) d\\tau$。' },
          { type: 'text', value: '**延迟器（离散）**：$x[n-1]$（单位延迟）。' },
          { type: 'text', value: '**直接I型**：将微分/差分方程直接翻译为方框图，先实现零点再实现极点。' },
          { type: 'text', value: '**直接II型**：交换级联顺序，使用更少的延迟/积分单元（典范型实现）。' },
          { type: 'question', value: '直接II型实现为什么比直接I型使用的延迟单元更少？' }
        ],
        aiHint: '方框图表示是系统实现的桥梁'
      }
    ],
    exercises: [
      '2.1 计算卷积 $x[n] * h[n]$，其中 $x[n] = \\{1,2,3\\}$（$n=0,1,2$），$h[n] = \\{1,1,1\\}$（$n=0,1,2$）。',
      '2.2 计算卷积积分 $e^{-t}u(t) * e^{-2t}u(t)$。',
      '2.3 判断 $h(t) = e^{-|t|}$ 对应的LTI系统是否因果、是否稳定。',
      '2.4 求解微分方程 $\\frac{dy(t)}{dt} + 2y(t) = x(t)$，输入 $x(t) = e^{-t}u(t)$，初始条件 $y(0^-)=1$。',
      '2.5 求解差分方程 $y[n] - \\frac{1}{2}y[n-1] = x[n]$，输入 $x[n] = u[n]$，初始条件 $y[-1]=0$。',
      '2.6 画出系统 $\\frac{d^2y(t)}{dt^2} + 3\\frac{dy(t)}{dt} + 2y(t) = \\frac{dx(t)}{dt} + x(t)$ 的直接II型方框图。'
    ]
  }
}
