import React, { Component } from 'react';

export default class PhotoFrame extends Component {
    constructor(props) {
        super(props);
    }

     render() {
       return (<table className="photo-frame" style={{ minHeight: "200px", visibility: this.props.hidden ? 'hidden' : 'visible', backgroundImage: this.props.defaultImage ? 'url("/images/default-image.png")' : null, backgroundPosition: this.props.defaultImage ? 'center' : null }}>
            <tbody>
                 <tr>
                     <td className="topx--" />
                     <td className="top-x-" />
                     <td className="top--x" />
                 </tr>
                 <tr>
                     <td className="midx--" />
                     <td>
                        {this.props.children}
                     </td>
                     <td className="mid--x" />
                 </tr>
                 <tr>
                     <td className="botx--" />
                     <td className="bot-x-" />
                     <td className="bot--x" />
                 </tr>
             </tbody>
         </table>);
    };
};

