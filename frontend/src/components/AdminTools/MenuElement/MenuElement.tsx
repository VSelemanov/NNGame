import * as React from 'react';
import style from './MenuElement.module.scss';
import { Link } from 'react-router-dom';

interface IMenuElement {
	name: string;
	link: string;
}
const MenuElement = (props: IMenuElement) => {
	return (
		<Link to={props.link}>
			<button className={style.button}>{props.name}</button>
		</Link>
	);
};

export default MenuElement;
