import React from 'react';

import Login from 'modules/components/Headers/Login';
import Guest from 'modules/components/Headers/Guest';

function Header(props) {
	if (props.state === "login") {
		return <Login {...props} />
	} else {
		return <Guest {...props} />
	}
}

export default Header;
