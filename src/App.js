// @flow
import React from 'react';

type Props = {
	message: string;
};

const App = (props: Props) => {
 return (
 	<div>
 		<h1>Decentralized BBS</h1>
 		<h3>{props.message}</h3>
 	</div>
 );
};
export default App;