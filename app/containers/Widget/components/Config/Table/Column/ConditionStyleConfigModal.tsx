import React from 'react'
import { fromJS } from 'immutable'

import { Icon, Row, Col, Modal, InputNumber, Button, Radio, Select } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option

import ColorPicker from 'components/ColorPicker'
import ConditionValuesControl from 'components/ConditionValuesControl'

import { OperatorTypesLocale, TableCellConditionOperatorTypes } from 'utils/operatorTypes'
import { ITableConditionStyle } from './types'
import { TableConditionStyleTypes, AvailableTableConditionStyleTypes, TableConditionStyleTypesSetting } from './constants'

import styles from './styles.less'
import stylesConfig from '../styles.less'

interface IConditionStyleConfigModalProps {
  visible: boolean
  visualType: string
  style: ITableConditionStyle
  onCancel: () => void
  onSave: (style: ITableConditionStyle) => void
}

interface IConditionStyleConfigModalStates {
  localStyle: ITableConditionStyle
}

class ConditionStyleConfigModal extends React.PureComponent<IConditionStyleConfigModalProps, IConditionStyleConfigModalStates> {

  public constructor (props) {
    super(props)
    this.state = {
      localStyle: null
    }
  }

  public componentWillReceiveProps (props) {
    const { style } = props
    // @ts-ignore
    const localStyle: ITableConditionStyle = style && fromJS(style).toJS()
    this.setState({
      localStyle
    })
  }

  private propChange = (propName: string, propPath?: 'colors' | 'bar') => (e) => {
    const value = e.target ? e.target.value : e
    this.setState(({ localStyle }) => {
      if (!propPath) {
        return {
          localStyle: { ...localStyle, [propName]: value }
        }
      } else {
        const subProp = localStyle[propPath]
        return {
          localStyle: {
            ...localStyle,
            [propPath]: { ...subProp, [propName]: value }
          }
        }
      }
    })
  }

  private getOperatorTypeOptions (visualType: string) {
    const options = Object.entries(TableCellConditionOperatorTypes)
      .filter(([_, values]) => ~values.indexOf(visualType))
      .map(([type]) => (
        <Option key={type} value={type}>{OperatorTypesLocale[type]}</Option>
      ))
    return options
  }

  private renderConfigItems = () => {
    const { localStyle } = this.state
    const { type } = localStyle
    switch (type) {
      case TableConditionStyleTypes.BackgroundColor:
        return this.renderBackgroundColor()
      case TableConditionStyleTypes.TextColor:
        return this.renderTextColor()
      case TableConditionStyleTypes.NumericBar:
        return this.renderNumericBar()
      case TableConditionStyleTypes.Custom:
        return this.renderCustom()
      default:
        return null
    }
  }

  private renderBackgroundColor = () => {
    const { localStyle } = this.state
    const { colors } = localStyle
    const { background, fore } = colors
    return (
      <Row gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
        <Col span={8}>?????????</Col>
        <Col span={4} className={styles.colColor}>
          <ColorPicker
            className={stylesConfig.color}
            value={background}
            onChange={this.propChange('background', 'colors')}
          /><label>??????</label>
        </Col>
        <Col span={4} className={styles.colColor}>
          <ColorPicker
            className={stylesConfig.color}
            value={fore}
            onChange={this.propChange('fore', 'colors')}
          /><label>??????</label>
        </Col>
      </Row>
    )
  }

  private renderTextColor = () => {
    const { localStyle } = this.state
    const { colors } = localStyle
    const { fore } = colors
    return (
      <Row gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
        <Col span={8}>?????????</Col>
        <Col span={4} className={styles.colColor}>
          <ColorPicker
            className={stylesConfig.color}
            value={fore}
            onChange={this.propChange('fore', 'colors')}
          /><label>??????</label>
        </Col>
      </Row>
    )
  }

  private zeroPositionOptions = [{ label: '??????', value: 'auto' }, { label: '??????', value: 'center' }]
  private barModeOptions = [{ label: '??????', value: 'auto' }, { label: '?????????', value: 'fixed' }]

  private renderNumericBar = () => {
    const { localStyle } = this.state
    const { zeroPosition, colors, bar } = localStyle
    const { positive, negative, fore } = colors
    const { mode: barMode, max: barMax, min: barMin } = bar
    return (
      <>
        <Row key="zeroPosition" gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
          <Col span={8}>??????????????????</Col>
          <Col span={16}>
            <RadioGroup options={this.zeroPositionOptions} onChange={this.propChange('zeroPosition')} value={zeroPosition} />
          </Col>
        </Row>
        <Row key="zeroPositionValues" gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
          <Col span={8}>?????????</Col>
          <Col span={4} className={styles.colColor}>
            <ColorPicker
              className={stylesConfig.color}
              value={positive}
              onChange={this.propChange('positive', 'colors')}
            /><label>??????</label>
          </Col>
          <Col span={4} className={styles.colColor}>
            <ColorPicker
              className={stylesConfig.color}
              value={negative}
              onChange={this.propChange('negative', 'colors')}
            /><label>??????</label>
          </Col>
          <Col span={4} className={styles.colColor}>
            <ColorPicker
              className={stylesConfig.color}
              value={fore}
              onChange={this.propChange('fore', 'colors')}
            /><label>??????</label>
          </Col>
        </Row>
        <Row gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
          <Col span={8}>??????(???)??????</Col>
          <Col span={16}>
            <RadioGroup options={this.barModeOptions} onChange={this.propChange('mode', 'bar')} value={barMode} />
          </Col>
        </Row>
        {barMode === 'fixed' && (
          <>
            <Row gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
              <Col offset={13} span={4}>????????????</Col>
              <Col span={7}><InputNumber size="small" className={stylesConfig.colControl} value={barMin} onChange={this.propChange('min', 'bar')} /></Col>
            </Row>
            <Row gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
              <Col offset={13} span={4}>????????????</Col>
              <Col span={7}><InputNumber size="small" className={stylesConfig.colControl} value={barMax} onChange={this.propChange('max', 'bar')} /></Col>
            </Row>
          </>
        )}
      </>
    )
  }

  private renderCustom = () => {
    return (
      <Row gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
        <Col span={6}>???????????????</Col>
        <Col span={3}>
          <Icon type="edit" />
        </Col>
      </Row>
    )
  }

  private cancel = () => {
    this.props.onCancel()
  }

  private save = () => {
    this.props.onSave(this.state.localStyle)
  }

  private modalFooter = [(
    <Button
      key="cancel"
      size="large"
      onClick={this.cancel}
    >
      ??? ???
    </Button>
  ), (
    <Button
      key="submit"
      size="large"
      type="primary"
      onClick={this.save}
    >
      ??? ???
    </Button>
  )]

  private getConditionTypeOptions (visualType: string) {
    const options = Object.entries(AvailableTableConditionStyleTypes)
      .filter(([type]) => ~TableConditionStyleTypesSetting[type].indexOf(visualType))
      .map(([type, name]) => (
        <Option key={type} value={type}>{name}</Option>
      ))
    return options
  }

  private conditionValuesChange = (values) => {
    this.setState({
      localStyle: {
        ...this.state.localStyle,
        conditionValues: values
      }
    })
  }

  public render () {
    const { visible, visualType } = this.props
    const { localStyle } = this.state
    if (!localStyle) { return (<div />) }

    const { type, operatorType, conditionValues } = localStyle

    return (
      <Modal
        title="????????????"
        width={500}
        maskClosable={false}
        footer={this.modalFooter}
        visible={visible}
        onCancel={this.cancel}
        onOk={this.save}
      >
        <div className={stylesConfig.rows}>
          <Row gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
            <Col span={8}>???????????????</Col>
            <Col span={16}>
              <Select
                size="small"
                className={stylesConfig.colControl}
                value={type}
                onChange={this.propChange('type')}
              >
                {this.getConditionTypeOptions(visualType)}
              </Select>
            </Col>
          </Row>
          <Row key="operatorType" gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
            <Col span={8}>?????????</Col>
            <Col span={16}>
              <Select
                size="small"
                className={stylesConfig.colControl}
                value={operatorType}
                onChange={this.propChange('operatorType')}
              >
                {this.getOperatorTypeOptions(visualType)}
              </Select>
            </Col>
          </Row>
          <Row key="valueControls" gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
            <Col span={8}>??????</Col>
            <Col span={16}>
              <ConditionValuesControl
                size="small"
                visualType={visualType}
                operatorType={operatorType}
                conditionValues={conditionValues}
                onChange={this.conditionValuesChange}
              />
            </Col>
          </Row>
          {this.renderConfigItems()}
        </div>
      </Modal>
    )
  }
}

export default ConditionStyleConfigModal
