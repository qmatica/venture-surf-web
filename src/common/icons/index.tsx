import React from 'react'
import styles from './styles.module.sass'

export const PreloaderIcon = ({ stroke = 'white' }) => (
  <svg className={styles.preloader} width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path stroke={stroke} d="M25 14C25 16.1756 24.3549 18.3023 23.1462 20.1113C21.9375 21.9202 20.2195 23.3301 18.2095 24.1627C16.1995 24.9952 13.9878 25.2131 11.854 24.7886C9.72022 24.3642 7.76021 23.3165 6.22183 21.7782C4.68345 20.2398 3.6358 18.2798 3.21137 16.146C2.78693 14.0122 3.00477 11.8005 3.83733 9.79048C4.66989 7.78049 6.07979 6.06253 7.88873 4.85383C9.69767 3.64514 11.8244 3 14 3" strokeWidth="6" strokeLinecap="round" />
  </svg>
)

export const UserIcon = ({ fill = 'white' }) => (
  <svg className={styles.user} width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M7.05882 9.14286C10.821 9.14286 14.1176 10.5531 14.1176 13.649C14.1176 15.2718 13.4691 16 12.0969 16H2.02076C0.64854 16 0 15.2718 0 13.649C0 10.5531 3.29667 9.14286 7.05882 9.14286ZM7.05882 0C9.26862 0 11.0588 1.73905 11.0588 3.88571C11.0588 6.03237 9.26862 7.77143 7.05882 7.77143C4.84903 7.77143 3.05882 6.03237 3.05882 3.88571C3.05882 1.73905 4.84903 0 7.05882 0Z" />
  </svg>
)

export const UserCircleIcon = ({ fill = '#CDD5E5' }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M14 3C20.0751 3 25 7.92487 25 14C25 20.0751 20.0751 25 14 25C7.92487 25 3 20.0751 3 14C3 7.92487 7.92487 3 14 3ZM14 19.9583C12.0879 19.9583 10.26 20.4918 8.68628 21.4699C10.185 22.5383 12.0191 23.1667 14 23.1667C15.9805 23.1667 17.8143 22.5386 19.313 21.4708C17.7395 20.4917 15.9119 19.9583 14 19.9583ZM14 4.83333C8.93739 4.83333 4.83333 8.93739 4.83333 14C4.83333 16.3977 5.7539 18.5804 7.26088 20.2139C9.22015 18.8658 11.5534 18.125 14 18.125C16.4469 18.125 18.7804 18.866 20.7399 20.2126C22.2464 18.5796 23.1667 16.3973 23.1667 14C23.1667 8.93739 19.0626 4.83333 14 4.83333ZM14 8.04167C16.4055 8.04167 18.3542 9.99035 18.3542 12.3958C18.3542 14.8013 16.4055 16.75 14 16.75C11.5945 16.75 9.64583 14.8013 9.64583 12.3958C9.64583 9.99035 11.5945 8.04167 14 8.04167ZM14 9.875C12.607 9.875 11.4792 11.0029 11.4792 12.3958C11.4792 13.7888 12.607 14.9167 14 14.9167C15.393 14.9167 16.5208 13.7888 16.5208 12.3958C16.5208 11.0029 15.393 9.875 14 9.875Z" />
  </svg>
)

export const CalendarIcon = ({ fill = '#CDD5E5' }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} fillRule="evenodd" clipRule="evenodd" d="M9 2C9.41421 2 10 2.33579 10 2.75V5H18V2.75C18 2.33579 18.5858 2 19 2C19.4142 2 20 2.33579 20 2.75V5H23C23.9665 5 25 6 25 7.13807C25 8.27614 25 23 25 23C25 23.9665 23.9665 25 23 25H5C4 25 3 23.9665 3 23C3 23 3 8.27614 3 7.13807C3 6 4.0335 5 5 5H8V2.75C8 2.33579 8.58579 2 9 2ZM5.25 6.88807C5.11193 6.88807 5 7 5 7.13807V9H23C23 9 23 7.27614 23 7.13807C23 7 22.75 6.88807 22.75 6.88807H5.25ZM23 11H5V22.75C5 22.8881 5.11193 23 5.25 23H22.75C22.8881 23 23 22.8881 23 22.75V11Z" />
  </svg>
)

export const UsersIcon = ({ fill = '#CDD5E5' }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M9.05882 15.1429C12.821 15.1429 16.1176 16.5531 16.1176 19.649C16.1176 21.2718 15.4691 22 14.0969 22H4.02076C2.64854 22 2 21.2718 2 19.649C2 16.5531 5.29667 15.1429 9.05882 15.1429ZM18.9412 15.1429C22.7033 15.1429 26 16.5531 26 19.649C26 21.2718 25.3515 22 23.9792 22H18.4706C17.9508 22 17.5294 21.5907 17.5294 21.0857C17.5294 20.5808 17.9508 20.1714 18.4706 20.1714L24.0356 20.1717C24.0515 20.1719 24.0648 20.1722 24.0757 20.173L24.0875 20.1742L24.0898 20.1607C24.0997 20.0864 24.1124 19.9586 24.1164 19.7697L24.1176 19.649C24.1176 17.9729 21.7765 16.9714 18.9412 16.9714C18.5386 16.9714 18.0958 16.9989 17.652 17.0545C17.1365 17.1191 16.6646 16.7655 16.5981 16.2647C16.5316 15.7639 16.8956 15.3056 17.4111 15.2409C17.9351 15.1753 18.4584 15.1429 18.9412 15.1429ZM9.05882 16.9714C6.22352 16.9714 3.88235 17.9729 3.88235 19.649C3.88235 19.9053 3.89831 20.0715 3.9102 20.1607L3.91153 20.1742L3.92429 20.173L3.94245 20.1721L14.1683 20.1719C14.1778 20.1722 14.1861 20.1725 14.1934 20.173L14.2052 20.1742L14.2074 20.1607C14.2193 20.0716 14.2353 19.9053 14.2353 19.649C14.2353 17.9729 11.8941 16.9714 9.05882 16.9714ZM18.9412 6C21.151 6 22.9412 7.73905 22.9412 9.88571C22.9412 12.0324 21.151 13.7714 18.9412 13.7714C16.7314 13.7714 14.9412 12.0324 14.9412 9.88571C14.9412 7.73905 16.7314 6 18.9412 6ZM9.05882 6C11.2686 6 13.0588 7.73905 13.0588 9.88571C13.0588 12.0324 11.2686 13.7714 9.05882 13.7714C6.84903 13.7714 5.05882 12.0324 5.05882 9.88571C5.05882 7.73905 6.84903 6 9.05882 6ZM18.9412 7.82857C17.771 7.82857 16.8235 8.74895 16.8235 9.88571C16.8235 11.0225 17.771 11.9429 18.9412 11.9429C20.1114 11.9429 21.0588 11.0225 21.0588 9.88571C21.0588 8.74895 20.1114 7.82857 18.9412 7.82857ZM9.05882 7.82857C7.88862 7.82857 6.94118 8.74895 6.94118 9.88571C6.94118 11.0225 7.88862 11.9429 9.05882 11.9429C10.229 11.9429 11.1765 11.0225 11.1765 9.88571C11.1765 8.74895 10.229 7.82857 9.05882 7.82857Z" />
  </svg>
)

export const ExploreIcon = ({ fill = '#CDD5E5' }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M14 3C7.928 3 3 7.928 3 14C3 20.072 7.928 25 14 25C20.072 25 25 20.072 25 14C25 7.928 20.072 3 14 3ZM14 22.8C9.149 22.8 5.2 18.851 5.2 14C5.2 9.149 9.149 5.2 14 5.2C18.851 5.2 22.8 9.149 22.8 14C22.8 18.851 18.851 22.8 14 22.8ZM9.10317 17.5685C8.71026 18.414 9.58598 19.2897 10.4315 18.8968L16.211 16.211L18.8968 10.4315C19.2897 9.58598 18.414 8.71026 17.5685 9.10317L11.789 11.789L9.10317 17.5685ZM14 12.79C14.671 12.79 15.21 13.329 15.21 14C15.21 14.671 14.671 15.21 14 15.21C13.329 15.21 12.79 14.671 12.79 14C12.79 13.329 13.329 12.79 14 12.79Z" />
  </svg>
)

export const EditIcon = ({ fill = '#1557FF' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M24 3.92578C24 4.44141 23.9023 4.94141 23.707 5.42578C23.5117 5.91016 23.2266 6.33984 22.8516 6.71484L7.41797 22.1484L0 24L1.85156 16.582L17.2852 1.14844C17.6602 0.773438 18.0898 0.488281 18.5742 0.292969C19.0586 0.0976562 19.5586 0 20.0742 0C20.6133 0 21.1211 0.105469 21.5977 0.316406C22.0742 0.519531 22.4883 0.800781 22.8398 1.16016C23.1992 1.51172 23.4805 1.92578 23.6836 2.40234C23.8945 2.87891 24 3.38672 24 3.92578ZM3.82031 16.7344C4.64844 17.0078 5.35938 17.4453 5.95312 18.0469C6.55469 18.6406 6.99219 19.3516 7.26562 20.1797L19.9336 7.5L16.5 4.06641L3.82031 16.7344ZM2.0625 21.9375L5.91797 20.9766C5.83984 20.6172 5.71094 20.2773 5.53125 19.957C5.35938 19.6367 5.14844 19.3516 4.89844 19.1016C4.64844 18.8516 4.36328 18.6406 4.04297 18.4688C3.72266 18.2891 3.38281 18.1602 3.02344 18.082L2.0625 21.9375ZM21 6.43359C21.1953 6.23828 21.3828 6.05469 21.5625 5.88281C21.7422 5.71094 21.9023 5.53125 22.043 5.34375C22.1836 5.14844 22.293 4.94141 22.3711 4.72266C22.457 4.49609 22.5 4.23437 22.5 3.9375C22.5 3.60156 22.4336 3.28906 22.3008 3C22.1758 2.70313 22 2.44531 21.7734 2.22656C21.5547 2 21.2969 1.82422 21 1.69922C20.7109 1.56641 20.3984 1.5 20.0625 1.5C19.7656 1.5 19.5039 1.54297 19.2773 1.62891C19.0586 1.70703 18.8516 1.81641 18.6562 1.95703C18.4688 2.09766 18.2891 2.25781 18.1172 2.4375C17.9453 2.61719 17.7617 2.80469 17.5664 3L21 6.43359Z" />
  </svg>
)

export const CloseIcon = () => (
  <svg className={styles.close} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L16 16M16 1L1 16" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const TrashCanIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.98913 3H11.9348V14H1.98913V3Z" fill="#96BAF6" />
    <path d="M0 0H13.9239V2H0V0Z" fill="#96BAF6" />
  </svg>
)

export const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0V12M12 6L0 6" stroke="#96BAF6" strokeWidth="2" />
  </svg>
)

export const Edit2Icon = ({ fill = '#96BAF6', size = '24' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M21.7071 7.29289L16.7071 2.29289C16.3166 1.90237 15.6834 1.90237 15.2929 2.29289L2.29289 15.2929C2.10536 15.4804 2 15.7348 2 16V21C2 21.5523 2.44772 22 3 22H8C8.26522 22 8.51957 21.8946 8.70711 21.7071L21.7071 8.70711C22.0976 8.31658 22.0976 7.68342 21.7071 7.29289ZM4 20V16.4142L16 4.41421L19.5858 8L7.58579 20H4Z" fill="black" />
    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="2" y="2" width="20" height="20">
      <path fillRule="evenodd" clipRule="evenodd" d="M21.7071 7.29289L16.7071 2.29289C16.3166 1.90237 15.6834 1.90237 15.2929 2.29289L2.29289 15.2929C2.10536 15.4804 2 15.7348 2 16V21C2 21.5523 2.44772 22 3 22H8C8.26522 22 8.51957 21.8946 8.70711 21.7071L21.7071 8.70711C22.0976 8.31658 22.0976 7.68342 21.7071 7.29289ZM4 20V16.4142L16 4.41421L19.5858 8L7.58579 20H4Z" fill="white" />
    </mask>
    <g mask="url(#mask0)">
      <rect width="24" height="24" fill={fill} />
    </g>
  </svg>
)

export const VideoIcon = () => (
  <svg width="34" height="26" viewBox="0 0 34 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5085 12.1045L14.5397 7.12407C14.2326 6.93215 13.8456 6.92199 13.5289 7.0975C13.2121 7.27302 13.0156 7.60664 13.0156 7.96875V17.9297C13.0156 18.2918 13.2121 18.6254 13.5289 18.8009C13.6794 18.8843 13.8456 18.9258 14.0117 18.9258C14.1952 18.9258 14.3784 18.8751 14.5396 18.7744L22.5084 13.7939C22.7997 13.6119 22.9766 13.2927 22.9766 12.9492C22.9766 12.6058 22.7997 12.2866 22.5085 12.1045ZM15.0079 16.1325V9.76591L20.1011 12.9492L15.0079 16.1325Z" fill="#96BAF6" />
    <path d="M29.0195 0H4.98047C2.23424 0 0 2.23424 0 4.98047V20.918C0 23.6642 2.23424 25.8984 4.98047 25.8984H29.0195C31.7658 25.8984 34 23.6642 34 20.918V4.98047C34 2.23424 31.7658 0 29.0195 0ZM32.0078 20.918C32.0078 22.5657 30.6673 23.9062 29.0195 23.9062H4.98047C3.33273 23.9062 1.99219 22.5657 1.99219 20.918V4.98047C1.99219 3.33273 3.33273 1.99219 4.98047 1.99219H29.0195C30.6673 1.99219 32.0078 3.33273 32.0078 4.98047V20.918Z" fill="#96BAF6" />
  </svg>
)

export const TimeIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 36C8.0744 36 0 27.9256 0 18C0 8.0744 8.0744 0 18 0C27.9256 0 36 8.0744 36 18C36 27.9256 27.9256 36 18 36ZM18 2.25C9.31503 2.25 2.25 9.31503 2.25 18C2.25 26.685 9.31503 33.75 18 33.75C26.685 33.75 33.75 26.685 33.75 18C33.75 9.31503 26.685 2.25 18 2.25Z" />
    <path d="M25.875 27.7501C25.5869 27.7501 25.299 27.6405 25.0799 27.4199L17.2049 19.5449C16.9934 19.3334 16.875 19.047 16.875 18.7501V8.24988C16.875 7.62888 17.379 7.12488 18 7.12488C18.621 7.12488 19.125 7.62888 19.125 8.24988V18.2834L26.6701 25.8286C27.1096 26.268 27.1096 26.9805 26.6701 27.4199C26.451 27.6405 26.1631 27.7501 25.875 27.7501V27.7501Z" />
  </svg>
)

export const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M11 13.5858V2C11 1.44772 11.4477 1 12 1C12.5523 1 13 1.44772 13 2V13.5858L15.2929 11.2929C15.6834 10.9024 16.3166 10.9024 16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L12.7078 16.7064C12.7054 16.7088 12.703 16.7112 12.7005 16.7136C12.6062 16.8063 12.498 16.8764 12.3828 16.9241C12.2657 16.9727 12.1375 16.9996 12.003 17C12.002 17 12.001 17 12 17C11.999 17 11.998 17 11.997 17C11.7254 16.9992 11.4792 16.8901 11.2995 16.7136C11.297 16.7112 11.2946 16.7088 11.2922 16.7064L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929C7.68342 10.9024 8.31658 10.9024 8.70711 11.2929L11 13.5858ZM2 17V20C2 21.6569 3.34315 23 5 23H19C20.6569 23 22 21.6569 22 20V17C22 16.4477 21.5523 16 21 16C20.4477 16 20 16.4477 20 17V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V17C4 16.4477 3.55228 16 3 16C2.44772 16 2 16.4477 2 17Z" fill="#96BAF6" />
    <mask id="DownloadIcon" mask-type="alpha" maskUnits="userSpaceOnUse" x="2" y="1" width="20" height="22">
      <path fillRule="evenodd" clipRule="evenodd" d="M11 13.5858V2C11 1.44772 11.4477 1 12 1C12.5523 1 13 1.44772 13 2V13.5858L15.2929 11.2929C15.6834 10.9024 16.3166 10.9024 16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L12.7078 16.7064C12.7054 16.7088 12.703 16.7112 12.7005 16.7136C12.6062 16.8063 12.498 16.8764 12.3828 16.9241C12.2657 16.9727 12.1375 16.9996 12.003 17C12.002 17 12.001 17 12 17C11.999 17 11.998 17 11.997 17C11.7254 16.9992 11.4792 16.8901 11.2995 16.7136C11.297 16.7112 11.2946 16.7088 11.2922 16.7064L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929C7.68342 10.9024 8.31658 10.9024 8.70711 11.2929L11 13.5858ZM2 17V20C2 21.6569 3.34315 23 5 23H19C20.6569 23 22 21.6569 22 20V17C22 16.4477 21.5523 16 21 16C20.4477 16 20 16.4477 20 17V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V17C4 16.4477 3.55228 16 3 16C2.44772 16 2 16.4477 2 17Z" fill="white" />
    </mask>
    <g mask="url(#DownloadIcon)">
      <rect width="24" height="24" fill="#96BAF6" />
    </g>
  </svg>
)

export const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M0.894336 10.2075C0.509967 10.8026 0.246141 11.2717 0.105573 11.5528C-0.0351909 11.8343 -0.0351909 12.1657 0.105573 12.4472C0.246141 12.7283 0.509967 13.1974 0.894336 13.7925C1.5305 14.7776 2.28113 15.762 3.14546 16.6839C5.66131 19.3675 8.6202 21 12 21C15.3798 21 18.3387 19.3675 20.8545 16.6839C21.7189 15.762 22.4695 14.7776 23.1057 13.7925C23.49 13.1974 23.7539 12.7283 23.8944 12.4472C24.0352 12.1657 24.0352 11.8343 23.8944 11.5528C23.7539 11.2717 23.49 10.8026 23.1057 10.2075C22.4695 9.22245 21.7189 8.23802 20.8545 7.31606C18.3387 4.63249 15.3798 3 12 3C8.6202 3 5.66131 4.63249 3.14546 7.31606C2.28113 8.23802 1.5305 9.22245 0.894336 10.2075ZM4.60454 15.3161C3.82825 14.488 3.14919 13.5974 2.57441 12.7075C2.41128 12.4549 2.26659 12.2176 2.14071 12C2.26659 11.7824 2.41128 11.5451 2.57441 11.2925C3.14919 10.4026 3.82825 9.51198 4.60454 8.68394C6.77619 6.36751 9.2548 5 12 5C14.7452 5 17.2238 6.36751 19.3955 8.68394C20.1718 9.51198 20.8508 10.4026 21.4256 11.2925C21.5887 11.5451 21.7334 11.7824 21.8593 12C21.7334 12.2176 21.5887 12.4549 21.4256 12.7075C20.8508 13.5974 20.1718 14.488 19.3955 15.3161C17.2238 17.6325 14.7452 19 12 19C9.2548 19 6.77619 17.6325 4.60454 15.3161ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="#96BAF6" />
    <mask id="EyeIcon" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="3" width="24" height="18">
      <path fillRule="evenodd" clipRule="evenodd" d="M0.894336 10.2075C0.509967 10.8026 0.246141 11.2717 0.105573 11.5528C-0.0351909 11.8343 -0.0351909 12.1657 0.105573 12.4472C0.246141 12.7283 0.509967 13.1974 0.894336 13.7925C1.5305 14.7776 2.28113 15.762 3.14546 16.6839C5.66131 19.3675 8.6202 21 12 21C15.3798 21 18.3387 19.3675 20.8545 16.6839C21.7189 15.762 22.4695 14.7776 23.1057 13.7925C23.49 13.1974 23.7539 12.7283 23.8944 12.4472C24.0352 12.1657 24.0352 11.8343 23.8944 11.5528C23.7539 11.2717 23.49 10.8026 23.1057 10.2075C22.4695 9.22245 21.7189 8.23802 20.8545 7.31606C18.3387 4.63249 15.3798 3 12 3C8.6202 3 5.66131 4.63249 3.14546 7.31606C2.28113 8.23802 1.5305 9.22245 0.894336 10.2075ZM4.60454 15.3161C3.82825 14.488 3.14919 13.5974 2.57441 12.7075C2.41128 12.4549 2.26659 12.2176 2.14071 12C2.26659 11.7824 2.41128 11.5451 2.57441 11.2925C3.14919 10.4026 3.82825 9.51198 4.60454 8.68394C6.77619 6.36751 9.2548 5 12 5C14.7452 5 17.2238 6.36751 19.3955 8.68394C20.1718 9.51198 20.8508 10.4026 21.4256 11.2925C21.5887 11.5451 21.7334 11.7824 21.8593 12C21.7334 12.2176 21.5887 12.4549 21.4256 12.7075C20.8508 13.5974 20.1718 14.488 19.3955 15.3161C17.2238 17.6325 14.7452 19 12 19C9.2548 19 6.77619 17.6325 4.60454 15.3161ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="white" />
    </mask>
    <g mask="url(#EyeIcon)">
      <rect width="24" height="24" fill="#96BAF6" />
    </g>
  </svg>
)

export const FilterIcon = () => (
  <svg width="21" height="12" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L20 1M3 6.00001L18 6.00001M5 11L16 11" stroke="#D7DFED" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const LikeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M16.0495 6.60511C15.6271 6.11936 15.0127 5.84361 14.3691 5.85089L10.9693 5.85086V3.65682C10.9693 2.04118 9.65954 0.731445 8.0439 0.731445C7.75488 0.731445 7.49297 0.901653 7.37559 1.16576L4.64325 7.31353H2.9245C1.71277 7.31353 0.730469 8.29584 0.730469 9.50756V14.627C0.730469 15.8387 1.71277 16.821 2.9245 16.821L5.11853 16.821C4.71462 16.821 4.38719 16.4936 4.38719 16.0897V15.3583H2.9245C2.52059 15.3583 2.19316 15.0309 2.19316 14.627V9.50756C2.19316 9.10365 2.52059 8.77622 2.9245 8.77622H4.38719V8.04488C4.38719 7.94255 4.40866 7.84136 4.45022 7.74785L4.64325 7.31353H5.11853C5.52244 7.31353 5.84987 7.64097 5.84987 8.04488V8.20008L8.48859 2.26295C9.07898 2.45115 9.50659 3.00404 9.50659 3.65682V6.58219C9.50659 6.9861 9.83402 7.31353 10.2379 7.31353H14.3773C14.6002 7.31106 14.805 7.40297 14.9458 7.56489C15.0866 7.72681 15.1492 7.94239 15.117 8.15453L14.1079 14.7355C14.053 15.0973 13.741 15.3625 13.3763 15.3584L5.84987 15.3583V16.0897C5.84987 16.493 5.52335 16.8201 5.12022 16.821H13.3681C14.4539 16.8333 15.3898 16.0378 15.5538 14.956L16.5629 8.37512C16.6597 7.7376 16.4719 7.09086 16.0495 6.60511Z" fill="#336DFF" />
    <mask id="likeIcon" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="17" height="17">
      <path fillRule="evenodd" clipRule="evenodd" d="M16.0495 6.60511C15.6271 6.11936 15.0127 5.84361 14.3691 5.85089L10.9693 5.85086V3.65682C10.9693 2.04118 9.65954 0.731445 8.0439 0.731445C7.75488 0.731445 7.49297 0.901653 7.37559 1.16576L4.64325 7.31353H2.9245C1.71277 7.31353 0.730469 8.29584 0.730469 9.50756V14.627C0.730469 15.8387 1.71277 16.821 2.9245 16.821L5.11853 16.821C4.71462 16.821 4.38719 16.4936 4.38719 16.0897V15.3583H2.9245C2.52059 15.3583 2.19316 15.0309 2.19316 14.627V9.50756C2.19316 9.10365 2.52059 8.77622 2.9245 8.77622H4.38719V8.04488C4.38719 7.94255 4.40866 7.84136 4.45022 7.74785L4.64325 7.31353H5.11853C5.52244 7.31353 5.84987 7.64097 5.84987 8.04488V8.20008L8.48859 2.26295C9.07898 2.45115 9.50659 3.00404 9.50659 3.65682V6.58219C9.50659 6.9861 9.83402 7.31353 10.2379 7.31353H14.3773C14.6002 7.31106 14.805 7.40297 14.9458 7.56489C15.0866 7.72681 15.1492 7.94239 15.117 8.15453L14.1079 14.7355C14.053 15.0973 13.741 15.3625 13.3763 15.3584L5.84987 15.3583V16.0897C5.84987 16.493 5.52335 16.8201 5.12022 16.821H13.3681C14.4539 16.8333 15.3898 16.0378 15.5538 14.956L16.5629 8.37512C16.6597 7.7376 16.4719 7.09086 16.0495 6.60511Z" fill="white" />
    </mask>
    <g mask="url(#likeIcon)">
      <rect width="17.5522" height="17.5522" fill="#629CFF" />
    </g>
  </svg>
)
