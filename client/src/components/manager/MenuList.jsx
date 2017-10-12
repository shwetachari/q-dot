import React from 'react';
import MenuListItem from './MenuListItem.jsx';
import _ from 'lodash';
import $ from 'jquery';
// require('webpack-jquery-ui/sortable');

class MenuList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalMenu: undefined,
      selectedVal: 'dish'
    };
  }

  updateSelected(e) {
    this.setState({
      selectedVal: e.target.value
    });
  }

  showModal(type, action, menuItem = {}) {
    let newModal = _.extend({}, menuItem);
    newModal.type = type;
    newModal.action = action;
    this.setState({ modalMenu: newModal });
    // everytime the state changed, modal needs to initialize.
    // so put the modal toggle in the next runloop of modal initialize
    setTimeout(() => $('#menu-form').modal('toggle'), 0);
  }

  render() {
    let dishName = (<div className="form-group">
      <label htmlFor="dish-name" className="form-control-label">Dish Name:</label>
      <input type="text" className="form-control" id="dish-name"/>
    </div>);
    let dishDescription = (<div className="form-group">
      <label htmlFor="dish-description" className="form-control-label">Dish Description:</label>
      <textarea className="form-control" id="dish-description"></textarea>
    </div>);
    let dishPrice = (<div className="form-group">
      <label htmlFor="dish-price" className="form-control-label">Dish Price:</label>
      <input type="number" className="form-control" id="dish-price" min="0.01" step="0.01" max="2500"/>
    </div>);

    return (
      <div className="col-xs-12">
        <div className="col-xs-12 menu-container">
          <div className="col-xs-12">
            <h3 className="col-xs-8">Menu</h3>
            <button className="col-xs-4" onClick={this.showModal.bind(this, 'POST', 'Add')}>Add Dish</button>
          </div>
          <ul className="menu col-xs-12">
            {this.props.menu.map((menuItem, index) => {
              return (<MenuListItem showModal={this.showModal.bind(this)} key={index} menuItem={menuItem}/>);
            })}
          </ul>
        </div>

        { this.state.modalMenu
          ? <div id="menu-form" className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h2 className="modal-title">Statement</h2>
                </div>
                <div className="modal-body">
                  <p className="warning-content">{this.state.modalMenu.action} Menu Item</p>
                </div>
                <div style={{marginTop: '30px'}} className="col-sm-10 col-sm-offset-1 col-xs-12 col-xs-offset-0">
                  { this.state.modalMenu.type === 'POST' ?
                  <form>
                    {dishName}
                    {dishDescription}
                    {dishPrice}
                  </form>
                  : ''
                  }
                  {this.state.modalMenu.type === 'PUT' ?
                  <form>
                    <div className="form-group">
                      <label htmlFor="dish-field" className="form-control-label">Which field are you modifying?</label>
                      <select id="dish-field" onChange={(e) => (this.updateSelected(e))}>
                        <option value="dish">Dish Name</option>
                        <option value="description">Dish Description</option>
                        <option value="price">Dish Price</option>
                      </select>
                    </div>
                    {this.state.selectedVal === 'dish' ? <div>{dishName}</div> : ''}
                    {this.state.selectedVal === 'description' ? <div>{dishDescription}</div> : ''}
                    {this.state.selectedVal === 'price' ? <div>{dishPrice}</div> : ''}
                  </form>
                  : ''
                  }
                  {this.state.modalMenu.type === 'DELETE' ? <div>Are you sure you wish to remove {this.state.modalMenu.dish}?</div> : ''}
                </div>


                <div className="modal-footer">
                  <button className="btn btn-warning" data-dismiss="modal" onClick={(e) => (this.props.updateMenu(this.state.modalMenu))}>{this.state.modalMenu.action} Dish</button>
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
          : []
        }
      </div>
    );
  }
}

export default MenuList;