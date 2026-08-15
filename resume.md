%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\usepackage{fontawesome5}
\usepackage{multicol}
\usepackage{graphicx}
\usepackage[export]{adjustbox}

\setlength{\multicolsep}{-3.0pt}
\setlength{\columnsep}{-1pt}
\input{glyphtounicode}


%----------FONT OPTIONS----------
% sans-serif
% \usepackage[sfdefault]{FiraSans}
% \usepackage[sfdefault]{roboto}
% \usepackage[sfdefault]{noto-sans}
% \usepackage[default]{sourcesanspro}

% serif
% \usepackage{CormorantGaramond}
% \usepackage{charter}


\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.6in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1.19in}
\addtolength{\topmargin}{-.7in}
\addtolength{\textheight}{1.4in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large\bfseries
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \item\small{
	{#1 \vspace{-2pt}}
  }
}

\newcommand{\classesList}[4]{
	\item\small{
    	{#1 #2 #3 #4 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
	\begin{tabular*}{1.0\textwidth}[t]{l@{\extracolsep{\fill}}r}
  	\textbf{#1} & \textbf{\small #2} \\
  	\textit{\small#3} & \textit{\small #4} \\
	\end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubSubheading}[2]{
	\item
	\begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
  	\textit{\small#1} & \textit{\small #2} \\
	\end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
	\item
	\begin{tabular*}{1.001\textwidth}{l@{\extracolsep{\fill}}r}
  	\small#1 & \textit{\small }\\
	\end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemi{$\vcenter{\hbox{\tiny$\bullet$}}$}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.0in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\begin{document}




\begin{center}
	{\Huge \scshape Sandeep Kumar Rai} \\ \vspace{1pt}
	Bengaluru, Karnataka, India \\ \vspace{1pt}
	\small \raisebox{-0.1\height}\faPhone\ +91 9369204281 ~ \href{mailto:raisandeep.dev@gmail.com}{\raisebox{-0.2\height}\faEnvelope\  \underline{raisandeep.dev@gmail.com}} ~
	\href{https://www.linkedin.com/in/rai-sandeep/}{\raisebox{-0.2\height}\faLinkedin\ \underline{linkedin.com/in/sandeeprai}}
	\vspace{-8pt}\hspace{18pt}
    
\end{center}




% \section{Profile}
% \text{I have a strong technical project background and gained valuable experience working with startups. Additionally, I have acquired industry experience through multiple completed internships. I am a team player and have led teams in numerous hackathons and projects. I am proficient in programming languages, technologies, frameworks, and libraries.
}

%-----------EDUCATION-----------
\section{Education}
\resumeSubHeadingListStart
  \resumeSubheading
    {Manipal Institute of Technology, Manipal}{May 2021 - May 2025}
    {B.Tech in Computer and Communication Engineering (CGPA: 8.6)}{Karnataka, India}
    
    \resumeItemListStart
      \resumeItem{Received the Achiever Scholarship, given to the top 5\% of students based on annual academic performance.}
      \resumeItem{Awarded a Rs. 50,000 per year scholarship from Schneider Electric in recognition of academic excellence and dedication.}
    \resumeItemListEnd

\resumeSubHeadingListEnd
  


%-----------EXPERIENCE-----------
\section{Experience}
\resumeSubHeadingListStart
	\resumeSubheading
  	{Microsoft}{July 2025 -- Current}
  	{ Software Development Engineer }{Onsite - Bengaluru}
  	\resumeItemListStart
    	\resumeItem{Designed and implemented an end-to-end observability system with 5 telemetry and alerting components across 3+ repositories, reducing production debugging time from hours to minutes (~10x improvement) and enabling proactive issue detection before customer escalation.
    	\resumeItem{Led the team-wide AI tooling adoption initiative with M3 level engagement and built end to end automation system that reduced monthly team reporting time from around 12 hours to 30-40 minutes by eliminating manual data collection and data analysis.}
	\resumeItemListEnd
    
  \resumeSubHeadingListEnd
 \vspace{-5pt}
\resumeSubHeadingListStart
	\resumeSubheading
  	{Amazon}{Jan 2025 -- Jun 2025}
  	{ SDE Intern }{Remote}
  	\resumeItemListStart
    	\resumeItem{Worked on improving the payments system at Amazon by implementing the General Data Protection Regulation (GDPR) compliance for the team, following the best coding standards within a strict timeline of 3 months. }
    	\resumeItem{Also implemented the Data Subject Access Request (DSAR) compliance for the data set owned by my team.}
    	% \resumeItem{Gained hands-on experience in software development, agile methodologies, and database management.}
	\resumeItemListEnd
    
  \resumeSubHeadingListEnd
 \vspace{-5pt}
  \resumeSubHeadingListStart
	\resumeSubheading
  	% {Baylink \href{https://drive.google.com/file/d/16ByJ7WEgUkc_QrvVym0UoGYUPaZBkTJK/view?usp=sharing}{\resumeItem{| Certificate}} }{March 2023 -- September 2023}
   {Microsoft}{May 2024 -- July 2024}
  	{ SWE Intern }{Bengaluru, Karnataka, India}
  	\resumeItemListStart
    	\resumeItem{Understood the team project requirements in a short time and developed 2 Machine Learning models for outlier detection for the 100s of noisy alerts our team got due to seasonality and predictable false alarms, reducing on-call engineers' investigation time by 5 times.}
	\resumeItemListEnd
    
  \resumeSubHeadingListEnd
  \vspace{-5pt}
  \resumeSubHeadingListStart
	\resumeSubheading
  	% {Baylink \href{https://drive.google.com/file/d/16ByJ7WEgUkc_QrvVym0UoGYUPaZBkTJK/view?usp=sharing}{\resumeItem{| Certificate}} }{March 2023 -- September 2023}
   {Baylink}{July 2023 -- March 2024}
  	{ SDE (Part-time) }{Manipal, Karnataka, India}
  	\resumeItemListStart
    	\resumeItem{Managed a team of 2 people to develop the official website and Flutter mobile application that could scale and was already handling around 4000 customers daily.}}
	\resumeItemListEnd
    
  \resumeSubHeadingListEnd
  \vspace{-8pt}
  \resumeSubHeadingListStart
	\resumeSubheading
  	{Digital India Corporation (Ministry of Electronics and IT)  \href{https://drive.google.com/file/d/12ICWIkYLpSxBcB4Tr21nxLoXgcTHhHkT/view?usp=sharing}{\resumeItem{| Certificate}}}{June 2023 -- July 2023  }
  	{ SDE Intern }{Delhi, India}
  	\resumeItemListStart
    	\resumeItem{Contributed significantly to the "API Setu" project, where key responsibilities included enhancing the API Setu website by implementing crucial features like editing, managing, and publishing APIs in adherence to OpenAPI 3.0 specifications}
    	\resumeItem{Collaborated with my mentor and a team of two members, employing diverse tech stacks such as NextJs, NestJs, MongoDB, etc. This collaborative effort ensured the efficient fulfillment of various project requirements and objectives.}
	\resumeItemListEnd
    
  \resumeSubHeadingListEnd
    \vspace{-4pt}
  \resumeSubHeadingListStart
	\resumeSubheading
  	{Intel Corporation  \href{https://drive.google.com/file/d/13rRWEFxU6DlYWS_mKsTcmwrFTzmgJEK6/view?usp=sharing}{\resumeItem{| Certificate}}}{May 2023 -- June 2023}
  	{ Project Intern }{Remote}
  	\resumeItemListStart
    	\resumeItem{Engaged in the development of a high-performance Convolutional Neural Network (CNN) model with accuracy of 94.3\% tailored for the Fashion MNIST dataset, utilizing PyTorch and incorporating Intel optimizations}
    	
	\resumeItemListEnd
    
  \resumeSubHeadingListEnd
    \vspace{-4pt}
  
    
  
% \vspace{-16pt}

%-----------PROJECTS-----------
\section{Projects }
	\vspace{-10pt}

	\resumeProjectHeading
      	{\textbf{Groot - a sustainable urban mobility solution} $|$ \emph{Flutter, ARcore, Nodejs, MongoDB}  $|$ {\href{https://github.com/sandeepkrai/Manipal_Hackathon_FluterApp}{Github Link}}}{February 2023}
      	\resumeItemListStart
        	\resumeItem{Developed a gamified and sustainable urban mobility solution that reduces carbon emissions, minimizes traffic congestion, and improves urban life quality.}
        	\resumeItem{
        	Incorporated inclusivity, affordability, and accessibility features, smart technologies like Augmented Reality, and utilized various open source APIs.}
      	\resumeItemListEnd
       \vspace{-13pt}
	\resumeSubHeadingListEnd

% \vspace{-15pt}

%
%-----------Achievements-----------
\section{Achievements}
 \begin{itemize}[leftmargin=0.05in, label={}]
	\resumeItemListStart
        \resumeItem{Achieved the first position in a national hackathon by T. A. Pai Management Institute, earning a prize of Rs. 40,000}}
    	\resumeItem{Successfully led a team to secure the top position in the eSamudaay Hackathon, receiving a prize of Rs. 25,000.}}
        \resumeItem{Attained a position among the top 6 teams in Manipal Hackathon (M\#), earning a prize of Rs. 10,000.}
        \resumeItem{Awarded a Rs. 50,000 scholarship from Schneider Electric in recognition of academic excellence and dedication.}
  	\resumeItemListEnd
 \end{itemize}
 \vspace{-16pt}
 
 %
%-----------Profile Links-----------
% \section{Profile Links}
%  \begin{itemize}[leftmargin=0.15in, label={}]
% 	\resumeItemListStart
% 	    \resumeItem {\href{https://leetcode.com/Sandeep_Rai/}{Leetcode}}
%     	\resumeItem {\href{https://www.codechef.com/users/rai_sandeep}{Codechef}}
    	
    	
%   	\resumeItemListEnd
%  \end{itemize}
%  \vspace{-16pt}

%
%-----------PROGRAMMING SKILLS-----------
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
	\small{\item{
 	{.NET, Distributed Systems, Agentic Automations, Microsoft Azure, AWS, LLD, HLD, Algorithms, Java, C++, C\#, Python} 
	}}
 \end{itemize}
 \vspace{-16pt}

% \section{Currently Learning}
%  \begin{itemize}[leftmargin=0.15in, label={}]
% 	\resumeItemListStart
% 	    \resumeItem {\text{NodeJS}}
% 	    \resumeItem {\text{MongoDB}}
% 	     \resumeItem {\text{Open Source Contribution}}
%   	\resumeItemListEnd
%  \end{itemize}
%  \vspace{-16pt}

\end{document}


