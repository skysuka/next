import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component, Children, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Animate from '../../animate';
import Icon from '../../icon';
import { func, obj } from '../../util';
import Item from './item';
import SelectabelItem from './selectable-item';
import PopupItem from './popup-item';

var Expand = Animate.Expand;
var bindCtx = func.bindCtx;

/**
 * Menu.SubMenu
 * @order 1
 */

var SubMenu = (_temp = _class = function (_Component) {
    _inherits(SubMenu, _Component);

    function SubMenu(props) {
        _classCallCheck(this, SubMenu);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        bindCtx(_this, ['handleMouseEnter', 'handleMouseLeave', 'handleClick', 'handleOpen', 'afterLeave']);
        return _this;
    }

    SubMenu.prototype.componentDidMount = function componentDidMount() {
        this.itemNode = findDOMNode(this);
    };

    SubMenu.prototype.afterLeave = function afterLeave() {
        var _props = this.props,
            focused = _props.focused,
            root = _props.root;
        var focusable = root.props.focusable;

        if (focusable && focused) {
            this.itemNode.focus();
        }
    };

    SubMenu.prototype.getOpen = function getOpen() {
        var _props2 = this.props,
            _key = _props2._key,
            root = _props2.root;
        var openKeys = root.state.openKeys;


        return openKeys.indexOf(_key) > -1;
    };

    SubMenu.prototype.handleMouseEnter = function handleMouseEnter(e) {
        this.handleOpen(true);

        this.props.onMouseEnter && this.props.onMouseEnter(e);
    };

    SubMenu.prototype.handleMouseLeave = function handleMouseLeave(e) {
        this.handleOpen(false);

        this.props.onMouseLeave && this.props.onMouseLeave(e);
    };

    SubMenu.prototype.handleClick = function handleClick(e) {
        var _props3 = this.props,
            root = _props3.root,
            selectable = _props3.selectable;
        var selectMode = root.props.selectMode;

        if (selectMode && selectable) {
            e.stopPropagation();
        }

        var open = this.getOpen();
        this.handleOpen(!open);
    };

    SubMenu.prototype.handleOpen = function handleOpen(open, triggerType, e) {
        var _props4 = this.props,
            _key = _props4._key,
            root = _props4.root;

        root.handleOpen(_key, open, triggerType, e);
    };

    SubMenu.prototype.passParentToChildren = function passParentToChildren(children) {
        var _this2 = this;

        var _props5 = this.props,
            mode = _props5.mode,
            root = _props5.root;


        return Children.map(children, function (child) {
            return cloneElement(child, {
                parent: _this2,
                parentMode: mode || root.props.mode
            });
        });
    };

    SubMenu.prototype.renderInline = function renderInline() {
        var _cx, _cx2, _cx3;

        var _props6 = this.props,
            _key = _props6._key,
            level = _props6.level,
            root = _props6.root,
            className = _props6.className,
            selectableFromProps = _props6.selectable,
            label = _props6.label,
            children = _props6.children,
            subMenuContentClassName = _props6.subMenuContentClassName,
            propsTriggerType = _props6.triggerType,
            parentMode = _props6.parentMode;
        var _root$props = root.props,
            prefix = _root$props.prefix,
            selectMode = _root$props.selectMode,
            rootTriggerType = _root$props.triggerType,
            inlineArrowDirection = _root$props.inlineArrowDirection,
            expandAnimation = _root$props.expandAnimation;

        var triggerType = propsTriggerType || rootTriggerType;
        var open = this.getOpen();
        var others = obj.pickOthers(Object.keys(SubMenu.propTypes), this.props);

        var liProps = {
            className: cx((_cx = {}, _cx[prefix + 'menu-sub-menu-wrapper'] = true, _cx[className] = !!className, _cx))
        };
        var itemProps = {
            'aria-expanded': open,
            _key: _key,
            level: level,
            root: root,
            type: 'submenu',
            component: 'div',
            parentMode: parentMode
        };
        var arrorProps = {
            type: inlineArrowDirection === 'right' ? 'arrow-right' : 'arrow-down',
            className: cx((_cx2 = {}, _cx2[prefix + 'menu-icon-arrow'] = true, _cx2[prefix + 'menu-icon-arrow-down'] = inlineArrowDirection === 'down', _cx2[prefix + 'menu-icon-arrow-right'] = inlineArrowDirection === 'right', _cx2[prefix + 'open'] = open, _cx2))
        };

        var selectable = !!selectMode && selectableFromProps;
        var NewItem = selectable ? SelectabelItem : Item;

        if (triggerType === 'hover') {
            liProps.onMouseEnter = this.handleMouseEnter;
            liProps.onMouseLeave = this.handleMouseLeave;
        } else if (selectable) {
            arrorProps.onClick = this.handleClick;
        } else {
            itemProps.onClick = this.handleClick;
        }
        if (open) {
            itemProps.className = prefix + 'opened';
        }

        var newSubMenuContentClassName = cx((_cx3 = {}, _cx3[prefix + 'menu-sub-menu'] = true, _cx3[subMenuContentClassName] = !!subMenuContentClassName, _cx3));

        var subMenu = open ? React.createElement(
            'ul',
            { role: 'menu', ref: 'subMenu', className: newSubMenuContentClassName },
            this.passParentToChildren(children)
        ) : null;

        return React.createElement(
            'li',
            _extends({}, others, liProps),
            React.createElement(
                NewItem,
                itemProps,
                React.createElement(
                    'span',
                    { className: prefix + 'menu-item-text' },
                    label
                ),
                React.createElement(Icon, arrorProps)
            ),
            expandAnimation ? React.createElement(
                Expand,
                { animationAppear: false, afterLeave: this.afterLeave },
                subMenu
            ) : subMenu
        );
    };

    SubMenu.prototype.renderPopup = function renderPopup() {
        var _cx4;

        var _props7 = this.props,
            children = _props7.children,
            subMenuContentClassName = _props7.subMenuContentClassName,
            others = _objectWithoutProperties(_props7, ['children', 'subMenuContentClassName']);

        var root = this.props.root;
        var _root$props2 = root.props,
            prefix = _root$props2.prefix,
            popupClassName = _root$props2.popupClassName,
            popupStyle = _root$props2.popupStyle;


        var newClassName = cx((_cx4 = {}, _cx4[prefix + 'menu'] = true, _cx4[prefix + 'ver'] = true, _cx4[popupClassName] = !!popupClassName, _cx4[subMenuContentClassName] = !!subMenuContentClassName, _cx4));

        return React.createElement(
            PopupItem,
            _extends({}, others, { hasSubMenu: true }),
            React.createElement(
                'ul',
                { role: 'menu', className: newClassName, style: popupStyle },
                this.passParentToChildren(children)
            )
        );
    };

    SubMenu.prototype.render = function render() {
        var _props8 = this.props,
            mode = _props8.mode,
            root = _props8.root;

        var newMode = mode || root.props.mode;

        return newMode === 'popup' ? this.renderPopup() : this.renderInline();
    };

    return SubMenu;
}(Component), _class.menuChildType = 'submenu', _class.propTypes = {
    _key: PropTypes.string,
    root: PropTypes.object,
    level: PropTypes.number,
    groupIndent: PropTypes.number,
    /**
     * 标签内容
     */
    label: PropTypes.node,
    /**
     * 是否可选，该属性仅在设置 Menu 组件 selectMode 属性后生效
     */
    selectable: PropTypes.bool,
    /**
     * 子菜单打开方式，如果设置会覆盖 Menu 上的同名属性
     * @default Menu 的 mode 属性值
     */
    mode: PropTypes.oneOf(['inline', 'popup']),
    /**
     * 菜单项或下一级子菜单
     */
    children: PropTypes.node,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    subMenuContentClassName: PropTypes.string,
    triggerType: PropTypes.oneOf(['click', 'hover']),
    align: PropTypes.oneOf(['outside', 'follow']),
    parentMode: PropTypes.oneOf(['inline', 'popup'])
}, _class.defaultProps = {
    groupIndent: 0,
    selectable: false
}, _temp);
SubMenu.displayName = 'SubMenu';
export { SubMenu as default };