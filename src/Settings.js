import React from 'react';

function Settings(props) {
    return <form>
        <input type="checkbox" id="red" onChange={props.red}/>
        <label htmlFor="red">AI Plays Red</label><br/>
        <input type="checkbox" id="black" defaultChecked onChange={props.black}/>
        <label htmlFor="black">AI Plays Black</label><br/>
        <input type="checkbox" id="stats" onChange={props.stats}/>
        <label htmlFor="stats">Display AI Stats</label><br/>
      </form>
}

export default Settings;