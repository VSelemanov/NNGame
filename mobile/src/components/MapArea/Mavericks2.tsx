import React from "react";
import Svg, { Path } from "react-native-svg";
import { rem, WIDTH } from "../../constants/constants";
import { lg } from "../../utils/helper";

interface IP {}

export default class Mavericks2 extends React.Component<IP> {
	public render() {
		return (
			<Svg
				// height="100%"
				// width="100%"
				// viewBox="0 0 1854 1393"
				fill="none"
				width={`${WIDTH / 6}`}
				height={`${WIDTH / 6}`}
				viewBox={`0 0 ${WIDTH / 3} ${WIDTH / 3}`}
				style={{ position: "absolute", bottom: rem * 3, left: rem * 3 }}
			>
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M331.903 129.572C337.904 128.025 343.542 127.763 349.216 128.188C351.475 128.358 353.695 128.861 355.982 128.876C359.805 128.903 363.613 128.93 367.371 128.09C368.235 127.897 369.153 127.511 370.052 128.237C370.008 129.349 369.061 129.473 368.394 129.8C362.674 132.609 356.592 132.569 350.513 131.741C344.793 130.961 339.206 131.347 333.634 132.667C333.234 132.762 332.857 132.95 332.454 133.043C329.155 133.801 328.057 132.877 328.237 129.496C328.262 129.09 328.336 128.683 328.401 128.134C327.21 127.801 326.162 128.26 325.102 128.522C316.498 130.653 308.051 133.393 299.388 135.317C294.943 136.306 290.48 137.056 285.907 136.908C278.005 136.648 270.265 137.442 262.77 140.169C260.039 141.162 259.028 140.28 258.905 137.279C258.871 136.469 259.028 135.642 258.59 134.711C254.918 135.325 251.298 135.969 247.664 136.532C242.468 137.341 237.258 138.035 232.068 138.882C228.266 139.502 224.445 139.096 220.634 139.27C216.558 139.456 212.697 140.431 208.922 141.881C208.084 142.206 207.308 142.894 206.26 142.305C206.055 141.112 207.145 140.777 207.794 140.32C211.626 137.624 216.011 136.367 220.611 136.348C233.282 136.298 245.591 133.717 257.953 131.448C258.563 131.334 259.177 131.221 259.791 131.204C261.527 131.156 262.193 131.758 262.428 133.504C262.548 134.411 262.256 135.361 262.69 136.254C263.776 136.566 264.692 135.987 265.658 135.719C270.047 134.493 274.52 133.453 279.068 133.688C290.51 134.281 301.386 131.636 312.216 128.492C317.563 126.939 322.911 125.396 328.365 124.252C331.87 123.516 332.549 124.097 332.209 127.553C332.165 128.046 332.062 128.536 331.903 129.572Z"
					fill="#967E59"
				/>
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M436.808 40.6913C438.414 40.0541 440.026 39.4421 441.619 38.7777C445.896 36.9919 450.166 35.1852 454.44 33.3868C454.817 33.2296 455.192 33.0012 455.586 32.9509C456.626 32.8146 456.858 33.3868 456.582 34.265C456.357 34.9797 455.829 35.4849 455.284 35.9648C454.352 36.7928 453.312 37.4572 452.17 37.9518C447.535 39.9535 442.901 41.9551 438.259 43.9316C437.697 44.1685 437.079 44.3299 436.473 44.397C434.119 44.6443 433.071 43.7137 432.947 41.297C432.906 40.4733 432.935 39.6475 432.931 38.8217C432.931 38.1132 432.931 37.4069 432.931 36.8242C432.013 36.1221 431.392 36.6419 430.749 36.8619C425.002 38.8238 419.192 40.5907 413.685 43.2337C410.083 44.9608 406.054 44.8224 402.166 45.1913C398.064 45.5812 393.933 45.5686 389.865 46.363C387.524 46.8199 385.35 47.7799 383.074 48.4359C382.382 48.635 381.712 48.9201 381.007 49.0416C377.777 49.5908 376.836 49.0374 375.639 45.9752C375.455 45.4973 375.25 45.0215 375.095 44.5311C373.862 40.6431 373.831 40.5383 369.785 41.8881C364.047 43.7996 358.253 44.8035 352.171 44.1852C346.635 43.6235 341.347 45.0257 336.153 46.7884C335.671 46.9519 335.17 47.1553 334.676 47.1741C334.303 47.1867 333.852 47.0044 333.804 46.4783C333.77 46.1324 333.976 45.9962 334.28 45.8369C339.945 42.9256 345.919 40.8171 352.305 41.0581C358.958 41.3075 365.151 39.7879 371.324 37.6982C375.998 36.1116 376.388 36.3421 377.826 41.0434C378.153 42.127 378.44 43.2211 378.796 44.2942C379.186 45.4764 379.909 45.8872 381.175 45.4177C383.202 44.6673 385.26 43.9967 387.324 43.3616C392.216 41.863 397.318 41.9636 402.336 41.6177C407.335 41.2761 412.051 40.379 416.599 38.0923C421.757 35.4933 427.508 34.3908 432.916 32.3703C435.316 31.4732 436.364 32.4038 436.481 34.9756C436.523 35.8999 436.464 36.8326 436.506 37.759C436.538 38.6645 436.326 39.5951 436.808 40.6913Z"
					fill="#967E59"
				/>
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M186.008 104.654C187.613 104.017 189.225 103.405 190.818 102.74C195.096 100.955 199.366 99.148 203.639 97.3496C204.017 97.1924 204.392 96.9639 204.786 96.9136C205.825 96.7774 206.058 97.3496 205.781 98.2278C205.557 98.9425 205.029 99.4476 204.484 99.9276C203.551 100.756 202.512 101.42 201.369 101.915C196.735 103.916 192.101 105.918 187.458 107.894C186.897 108.131 186.278 108.293 185.673 108.36C183.319 108.607 182.271 107.676 182.147 105.26C182.105 104.436 182.135 103.61 182.13 102.784C182.13 102.076 182.13 101.37 182.13 100.787C181.212 100.085 180.592 100.605 179.949 100.825C174.201 102.787 168.391 104.553 162.885 107.196C159.282 108.924 155.254 108.785 151.366 109.154C147.264 109.544 143.133 109.531 139.065 110.326C136.723 110.783 134.55 111.743 132.274 112.399C131.582 112.598 130.911 112.883 130.207 113.004C126.977 113.554 126.036 113 124.839 109.938C124.655 109.46 124.449 108.984 124.294 108.494C123.062 104.606 123.03 104.501 118.985 105.851C113.246 107.762 107.453 108.766 101.371 108.148C95.8351 107.586 90.547 108.988 85.3532 110.751C84.8711 110.915 84.3702 111.118 83.8755 111.137C83.5025 111.149 83.0518 110.967 83.0036 110.441C82.97 110.095 83.1755 109.959 83.4794 109.8C89.1448 106.888 95.1183 104.78 101.505 105.021C108.157 105.27 114.351 103.751 120.524 101.661C125.198 100.074 125.587 100.305 127.025 105.006C127.352 106.09 127.639 107.184 127.996 108.257C128.386 109.439 129.109 109.85 130.375 109.38C132.401 108.63 134.46 107.959 136.524 107.324C141.416 105.826 146.518 105.926 151.536 105.58C156.534 105.239 161.25 104.342 165.799 102.055C170.957 99.4561 176.708 98.3536 182.116 96.333C184.516 95.436 185.564 96.3666 185.681 98.9384C185.723 99.8627 185.664 100.795 185.706 101.722C185.738 102.627 185.526 103.558 186.008 104.654Z"
					fill="#967E59"
				/>
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M44.7782 56.3058C50.997 53.8074 63.8474 52.1789 66.5658 53.4846C66.1341 54.6605 65.0023 54.7695 64.0528 55C60.5504 55.8405 57.0627 56.7606 53.4534 57.0792C50.9844 57.2972 48.5468 57.641 46.4173 59.1228C45.8556 59.5127 45.0801 59.6971 44.3842 59.7663C42.5209 59.9465 41.584 59.0892 41.3366 57.14C40.9677 54.2476 40.9573 54.1637 38.0942 54.5033C34.5101 54.9288 30.9281 55.2264 27.3125 55.088C25.9648 55.0398 24.6087 55 23.3595 54.4865C20.3895 53.2604 17.4719 53.7131 14.6382 54.7988C10.5196 56.3792 6.2543 57.6954 2.78547 60.6214C2.47946 60.8813 2.08333 61.0637 1.69767 61.1936C1.03534 61.4179 0.482003 61.2125 0.134072 60.5837C-0.169844 60.0303 0.079559 59.6196 0.515521 59.2612C2.02252 58.0162 3.38073 56.5091 5.0575 55.5701C9.54498 53.055 14.1854 50.8186 19.4191 50.2967C20.4377 50.1961 21.4983 50.0808 22.4834 50.4686C27.0861 52.2941 31.8168 51.4788 36.5159 51.1518C38.2619 51.0302 39.991 50.7096 41.7349 50.5964C44.141 50.4476 44.8663 51.2273 44.7447 53.69C44.7028 54.497 44.3863 55.3019 44.7782 56.3058Z"
					fill="#967E59"
				/>
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M423.012 96.0767C413.864 100.782 404.08 99.6063 394.451 99.4155C391.724 99.3652 389.043 98.2648 386.218 98.2879C383.933 98.3047 381.69 98.464 379.454 98.8915C378.811 99.0173 378.131 98.946 377.928 98.2208C377.683 97.3426 378.427 97.2986 379.024 97.1435C383.659 95.9571 388.314 95.299 393.057 96.5042C393.453 96.6048 393.876 96.6593 394.285 96.6614C400.982 96.7096 407.689 97.1414 414.352 96.0389C417.234 95.5631 420.009 94.8631 422.147 92.6539C422.495 92.2955 422.975 92.021 423.444 91.8302C424.922 91.2182 425.815 91.7422 426.022 93.3561C426.112 94.0666 426.043 94.7981 426.071 95.5191C426.177 98.2355 426.46 98.6589 429.21 98.2481C433.614 97.592 438.062 97.8016 442.474 97.3573C443.392 97.263 444.324 97.3028 445.253 97.3028C445.687 97.3028 446.095 97.4621 446.167 97.9358C446.232 98.3801 445.938 98.7322 445.553 98.8999C444.896 99.1892 444.23 99.535 443.53 99.6356C438.328 100.39 433.09 100.933 427.844 101.149C424.016 101.306 423.746 100.91 423.283 97.0345C423.254 96.7578 423.136 96.4938 423.012 96.0767Z"
					fill="#967E59"
				/>
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M362.59 3.65119C354.584 4.36172 346.642 4.14794 338.646 3.81468C339.346 2.9218 340.274 2.643 341.224 2.52773C345.407 2.00793 349.583 1.31836 353.812 1.29111C356.703 1.27225 359.541 1.0941 362.351 0.289244C364.946 -0.452729 365.659 0.171873 365.889 2.87358C366.147 5.86453 366.193 5.8813 369.247 5.39504C372.194 4.92764 375.143 4.47074 378.098 4.08928C379.28 3.93837 380.521 3.70357 381.766 4.29882C381.745 5.5082 380.766 5.63188 380.112 5.86453C375.724 7.41345 371.192 8.35662 366.558 8.64377C363.693 8.82192 363.246 8.27491 362.915 5.34265C362.848 4.7432 363.007 4.09134 362.59 3.65119Z"
					fill="#967E59"
				/>
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M474.871 121.48C472.964 121.701 471.241 122.587 469.528 123.421C465.041 125.603 460.252 126.785 455.433 127.888C454.433 128.116 453.186 128.573 452.687 126.815C459.267 125.574 465.492 123.602 471.371 120.613C472.289 120.145 473.238 119.743 474.184 119.334C477.376 117.947 478.011 118.355 477.984 121.793C477.984 122.204 477.954 122.617 477.91 123.025C477.759 124.388 478.573 124.612 479.633 124.436C481.05 124.197 482.446 123.79 483.867 123.618C486.831 123.262 489.803 122.906 492.8 123.042C494.793 123.132 496.644 122.39 498.572 122.103C499.048 122.03 499.658 121.948 499.92 122.528C500.195 123.128 499.706 123.495 499.306 123.784C497.596 125.004 495.711 125.792 493.571 125.777C489.027 125.746 484.536 126.184 480.098 127.171C479.501 127.305 478.874 127.339 478.26 127.339C475.64 127.334 474.965 126.618 474.94 124.058C474.93 123.258 475.429 122.457 474.871 121.48Z"
					fill="#967E59"
				/>
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M285 476.864C284.603 478.342 283.368 478.254 282.439 478.545C277.888 479.965 273.304 481.285 268.756 482.712C267.021 483.257 265.273 483.508 263.465 483.399C259.245 483.142 257.315 481.479 256.447 477.336C256.329 476.77 256.487 476.125 255.643 475.501C251.699 476.5 247.637 477.763 243.708 479.511C238.535 481.812 233.325 484.038 228.116 486.264C227.021 486.731 225.901 487.24 224.739 487.436C215.838 488.923 214.057 486.994 212.245 479.541C211.369 475.937 211.52 475.883 208.189 477.088C204.245 478.517 200.489 480.244 197.218 482.978C193.28 486.267 188.623 488.33 183.848 490.092C176.123 492.945 173.125 491.688 169.691 484.232C168.253 484.132 167.173 485.044 166.047 485.677C157.746 490.335 149.096 494.432 141.648 500.483C140.762 501.201 139.961 501.155 139.291 500.444C138.62 499.735 139.248 499.196 139.782 498.615C140.887 497.415 141.863 496.134 143.292 495.235C151.499 490.074 159.621 484.78 168.198 480.238C171.393 478.545 172.504 479.041 173.666 482.654C175.261 487.621 176.469 488.275 181.53 486.47C186.608 484.656 191.417 482.303 195.61 478.823C200.319 474.913 206.047 473.115 211.742 471.349C214.639 470.452 215.722 471.467 216.086 474.614C216.278 476.24 216.353 477.89 216.705 479.48C217.519 483.142 218.638 483.884 222.379 483.36C224.621 483.045 226.626 481.988 228.687 481.128C236.384 477.915 243.793 473.996 251.848 471.646C253.705 471.101 255.543 470.413 257.439 470.095C259.782 469.701 260.75 470.516 261.214 472.803C261.302 473.236 261.277 473.693 261.311 474.135C261.693 478.863 262.734 479.571 267.455 478.239C270.179 477.473 272.879 476.609 275.61 475.855C278.865 474.953 282.005 475.21 285 476.864Z"
					fill="#967E59"
				/>
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M278 394.173C277.825 394.768 277.831 395.183 277.652 395.307C271.43 399.594 264.908 403.187 257.222 403.609C252.916 403.844 248.598 403.829 244.287 403.807C240.108 403.785 236.029 404.067 231.959 405.306C226.922 406.843 225.065 405.988 222.604 401.118C221.54 399.015 220.285 398.786 218.344 399.003C210.482 399.885 202.787 401.626 195.237 403.937C189.91 405.566 184.715 405.548 179.445 403.937C172.802 401.911 165.972 401.775 159.12 401.781C157.596 401.784 155.144 402.49 155.005 400.356C154.872 398.343 157.517 398.649 158.869 398.476C165.993 397.553 173.125 398.095 180.18 399.315C184.667 400.093 189.015 400.019 193.393 398.656C202.231 395.905 211.259 394.08 220.454 393.111C224.149 392.724 225.059 393.21 226.502 396.85C228.159 401.038 228.18 401.1 232.216 399.861C234.526 399.151 236.854 398.829 239.246 398.826C242.37 398.823 245.511 398.594 248.613 398.872C257.385 399.65 265.779 398.287 273.894 394.827C275.064 394.331 276.316 393.6 278 394.173Z"
					fill="#967E59"
				/>
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M187.021 329.525C186.844 328.088 187.841 327.798 188.559 327.342C193.623 324.109 199.051 322.178 205.103 322.409C218.824 322.923 232.208 320.544 245.515 317.45C250.233 316.353 250.938 317.026 251.138 322.122C251.163 322.733 251.169 323.351 251.169 323.962C251.169 325.643 252.059 326.148 253.5 325.711C255.361 325.144 257.196 324.477 259.035 323.837C261.735 322.899 264.467 322.116 267.34 322.013C267.939 321.991 268.559 322.122 268.869 322.736C269.212 323.426 268.835 323.996 268.279 324.221C262.887 326.385 257.883 329.784 251.856 329.984C247.74 330.118 247.163 329.488 246.938 325.368C246.904 324.754 246.895 324.143 246.907 323.525C246.941 321.813 246.011 321.445 244.582 321.757C242.099 322.303 239.612 322.852 237.126 323.388C227.42 325.487 217.608 326.32 207.702 325.97C202.401 325.78 197.27 326.298 192.437 328.849C190.79 329.716 188.911 330.389 187.021 329.525Z"
					fill="#967E59"
				/>
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M151.309 358.725C150.121 358.725 148.935 358.707 147.747 358.731C145.81 358.764 144.094 358.191 143.409 356.284C142.616 354.072 141.285 354.32 139.575 354.923C134.679 356.646 129.765 358.312 124.848 359.971C123.165 360.538 121.491 361.241 119.648 360.919C118.689 360.75 117.94 360.225 118.004 359.174C118.058 358.281 118.444 357.207 119.406 357.129C127.352 356.489 134.233 352.25 141.868 350.593C142.012 350.56 142.157 350.518 142.299 350.479C145.445 349.664 145.596 349.6 146.942 352.639C147.497 353.894 148.181 354.12 149.264 354.099C151.635 354.048 154.049 354.241 156.374 353.873C162.884 352.844 169.4 353.161 175.919 353.481C179.638 353.662 183.336 353.532 187.044 353.33C187.737 353.294 188.654 352.992 188.932 353.933C189.267 355.062 188.298 355.397 187.508 355.795C185.49 356.815 183.342 357.403 181.101 357.509C171.173 357.989 161.21 357.636 151.309 358.725Z"
					fill="#967E59"
				/>
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M129 260.497C130.465 259.095 131.723 259.352 132.854 259.307C136.914 259.158 140.982 259.095 145.045 259.007C148.538 258.931 151.882 259.488 155.232 260.603C162.839 263.137 170.668 262.75 178.471 261.632C181.013 261.269 183.525 260.905 187 261.317C182.693 263.255 178.881 264.137 175.091 264.891C167.627 266.371 160.144 266.689 152.867 263.831C147.969 261.905 142.818 262.141 137.715 262.026C134.855 261.965 132.05 261.793 129 260.497Z"
					fill="#967E59"
				/>
			</Svg>
		);
	}
}
