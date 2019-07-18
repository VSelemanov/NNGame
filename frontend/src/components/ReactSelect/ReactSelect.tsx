import * as React from 'react';
import Select from 'react-select';
import style from './ReactSelect.module.scss';

const customStyles = {
	valueContainer: (styles: any) => ({
		...styles,
		height: 46
	}),
	control: (styles: any, { isFocused, isDisabled }: any) => ({
		...styles,
		// backgroundColor: isDisabled ? '#F5F5F5' : 'white',
		// borderColor: isDisabled ? '#e5e5e5' : isFocused ? '#F49530' : '#e5e5e5',
		// borderRadius: '4px',
		// borderStyle: 'solid',
		// borderWidth: 1,
		// padding: '0',
		// height: '30px',
		fontFamily: 'Preslav',
		height: 46
		// fontSize: "20px",
		// color: isDisabled ? '#F5F5F5' : '#000000',
		// boxShadow: null,
		// '&:hover': {
		// 	borderColor: '#F49530'
		// }
	}),
	option: (styles: any, { isSelected }: any) => ({
		...styles,
		fontFamily: 'Preslav'
		// fontSize: "20px",
		// height: '30px',
		// backgroundColor: isSelected ? '#D6D6D6' : 'white',
		// color: '#5b5b5b',
		// textOverflow: 'ellipsis',
		// whiteSpace: 'nowrap',
		// overflow: 'hidden',
		// '&:hover': {
		// 	backgroundColor: isSelected ? '#D6D6D6' : '#F3F3F3',
		// 	whiteSpace: 'normal'
		// }
	})
	// dropdownIndicator: (styles: any) => ({
	// 	...styles,
	// 	padding: '8px 4px'
	// }),
	// indicatorSeparator: (styles: any) => ({
	// 	...styles,
	// 	width: '0'
	// }),
	// valueContainer: (styles: any) => ({
	// 	...styles
	// })
};

// interface IProps {
// 	type: string;
// 	func?(e: any): void;
// 	size?: string;
// 	defaultValue?: string;
// 	title?: string;
// 	disabled?: boolean;
// 	value?: string;
// 	options?: any[];
// }

class ReactSelect extends React.Component<any> {
	public data: any = [];

	public render() {
		const size = this.props.size;
		// console.log('ReactSelect', this.props.data)
		return (
			<div className={size !== undefined ? `${style.main} ${style[size]}` : style.main}>
				<div className={style.field}>
					<Select
						className={'react-select'}
						options={this.props.data}
						styles={customStyles}
						defaultValue={this.props.data[0]}
						onChange={this.props.func}
						isSearchable={true}
						// isDisabled={this.props.disabled}
					/>
				</div>
			</div>
		);
	}
}

export default ReactSelect;
