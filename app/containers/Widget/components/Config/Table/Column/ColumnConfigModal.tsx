import React from 'react'
import classnames from 'classnames'
import produce from 'immer'
import set from 'lodash/set'
import { uuid } from 'utils/util'
import { fontWeightOptions, fontStyleOptions, fontFamilyOptions, fontSizeOptions } from '../constants'
import { defaultConditionStyle, AvailableTableConditionStyleTypes } from './constants'
import { getColumnIconByType } from './util'
import { ITableColumnConfig, ITableConditionStyle } from './types'
import ColorPicker from 'components/ColorPicker'
import ConditionStyleConfigModal from './ConditionStyleConfigModal'

import { Row, Col, Tooltip, Form, Select, InputNumber, Button, Radio, Checkbox, Table, Modal } from 'antd'
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const FormItem = Form.Item

import styles from './styles.less'
import stylesConfig from '../styles.less'

interface IColumnStyleConfigProps {
  visible: boolean
  config: ITableColumnConfig[]
  onCancel: () => void
  onSave: (config: ITableColumnConfig[]) => void
}

interface IColumnStyleConfigStates {
  localConfig: ITableColumnConfig[]
  selectedColumnName: string
  conditionStyleConfigModalVisible: boolean
  currentConditionStyle: ITableConditionStyle
}

export class ColumnStyleConfig extends React.PureComponent<IColumnStyleConfigProps, IColumnStyleConfigStates> {

  public constructor (props: IColumnStyleConfigProps) {
    super(props)
    const localConfig = props.config
    this.state = {
      localConfig,
      selectedColumnName: localConfig.length > 0 ? localConfig[0].columnName : '',
      conditionStyleConfigModalVisible: false,
      currentConditionStyle: null
    }
  }

  public componentWillReceiveProps (nextProps: IColumnStyleConfigProps) {
    if (nextProps.config === this.props.config) { return }
    const localConfig = nextProps.config
    this.setState({
      localConfig,
      selectedColumnName: localConfig.length > 0 ? localConfig[0].columnName : '',
      conditionStyleConfigModalVisible: false,
      currentConditionStyle: null
    })
  }

  private renderColumn (item: ITableColumnConfig) {
    const { selectedColumnName } = this.state
    const { columnName, alias, visualType } = item
    const displayName = alias || columnName
    const itemCls = classnames({
      [styles.selected]: selectedColumnName === columnName
    })
    return (
      <li className={itemCls} key={columnName} onClick={this.selectColumn(columnName)}>
        <i className={`iconfont ${getColumnIconByType(visualType)}`} />
        <Tooltip title={displayName} mouseEnterDelay={0.8}>
          <label>{displayName}</label>
        </Tooltip>
      </li>
    )
  }

  private selectColumn = (columnName: string) => () => {
    this.setState({
      selectedColumnName: columnName
    })
  }

  private propChange = (
    propPath: Exclude<keyof(ITableColumnConfig), 'style'> | ['style', keyof ITableColumnConfig['style']]
  ) => (e) => {
    const value = e.target ? (e.target.value || e.target.checked) : e
    const { localConfig, selectedColumnName } = this.state
    const nextLocalConfig = produce(localConfig, (draft) => {
      const selectedColumn = draft.find(({ columnName }) => columnName === selectedColumnName)
      set(selectedColumn, propPath, value)
      return draft
    })
    this.setState({
      localConfig: nextLocalConfig
    })
  }

  private cancel = () => {
    this.props.onCancel()
  }

  private save = () => {
    this.props.onSave(this.state.localConfig)
  }

  private columns = [{
    title: '',
    dataIndex: 'idx',
    width: 30,
    render: (_, __, index) => (index + 1)
  }, {
    title: '????????????',
    dataIndex: 'type',
    width: 50,
    render: (type) => AvailableTableConditionStyleTypes[type]
  }, {
    title: '??????',
    dataIndex: 'operation',
    width: 60,
    render: (_, record) => (
      <div className={styles.btns}>
        <Button onClick={this.editConditionStyle(record)} icon="edit" shape="circle" size="small" />
        <Button onClick={this.deleteConditionStyle(record.key)} icon="delete" shape="circle" size="small" />
      </div>
    )
  }]

  private addConditionStyle = () => {
    this.setState({
      conditionStyleConfigModalVisible: true,
      currentConditionStyle: {
        ...defaultConditionStyle
      }
    })
  }

  private editConditionStyle = (record) => () => {
    this.setState({
      currentConditionStyle: record,
      conditionStyleConfigModalVisible: true
    })
  }

  private deleteConditionStyle = (deletedKey: string) => () => {
    const { localConfig, selectedColumnName } = this.state
    const nextLocalConfig = produce(localConfig, (draft) => {
      const selectedColumn = draft.find(({ columnName }) => columnName === selectedColumnName)
      const idx = selectedColumn.conditionStyles.findIndex(({ key }) => key === deletedKey)
      selectedColumn.conditionStyles.splice(idx, 1)
    })
    this.setState({ localConfig: nextLocalConfig })
  }

  private closeConditionStyleConfig = () => {
    this.setState({
      conditionStyleConfigModalVisible: false,
      currentConditionStyle: null
    })
  }

  private saveConditionStyleConfig = (conditionStyle: ITableConditionStyle) => {
    const { localConfig, selectedColumnName } = this.state
    const nextLocalConfig = produce(localConfig, (draft) => {
      const selectedColumn = draft.find(({ columnName }) => columnName === selectedColumnName)
      if (conditionStyle.key) {
        const idx = selectedColumn.conditionStyles.findIndex(({ key }) => key === conditionStyle.key)
        selectedColumn.conditionStyles.splice(idx, 1, conditionStyle)
      } else {
        selectedColumn.conditionStyles.push({ ...conditionStyle, key: uuid(5) })
      }
    })
    this.setState({
      localConfig: nextLocalConfig,
      conditionStyleConfigModalVisible: false,
      currentConditionStyle: null
    })
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

  public render () {
    const { visible } = this.props
    const {
      localConfig, selectedColumnName,
      conditionStyleConfigModalVisible, currentConditionStyle } = this.state
    if (localConfig.length <= 0) {
      return (<div />)
    }

    const { style, visualType, sort, conditionStyles } = localConfig.find((c) => c.columnName === selectedColumnName)
    const { fontSize, fontFamily, fontWeight, fontColor, fontStyle, backgroundColor, justifyContent, inflexible, width } = style

    return (
      <Modal
        title="???????????????"
        wrapClassName="ant-modal-large"
        maskClosable={false}
        footer={this.modalFooter}
        visible={visible}
        onCancel={this.cancel}
        onOk={this.save}
      >
        <div className={styles.columnStyleConfig}>
          <div className={styles.left}>
            <div className={styles.title}>
              <h2>????????????</h2>
            </div>
            <div className={styles.list}>
              <ul>
                {localConfig.map((item) => this.renderColumn(item))}
              </ul>
            </div>
          </div>
          <div className={styles.right}>
              <div className={styles.title}><h2>???????????????</h2></div>
              <div className={stylesConfig.rows}>
                <Row gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
                  <Col span={12}>
                    <Checkbox checked={sort} onChange={this.propChange('sort')}>???????????????</Checkbox>
                  </Col>
                </Row>
              </div>
              <div className={styles.title}><h2>????????????</h2></div>
              <div className={stylesConfig.rows}>
                <Row gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
                  <Col span={3}>
                    <FormItem label="?????????">
                      <div className={styles.colorPickerWrapper}>
                        <ColorPicker
                          className={stylesConfig.color}
                          value={backgroundColor}
                          onChange={this.propChange(['style', 'backgroundColor'])}
                        />
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={9}>
                    <FormItem label="??????">
                      <RadioGroup size="small" value={justifyContent} onChange={this.propChange(['style', 'justifyContent'])}>
                        <RadioButton value="flex-start">?????????</RadioButton>
                        <RadioButton value="center">??????</RadioButton>
                        <RadioButton value="flex-end">?????????</RadioButton>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label="??????">
                      <Checkbox
                        checked={inflexible}
                        onChange={this.propChange(['style', 'inflexible'])}
                      >
                        ????????????
                      </Checkbox>
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label=" " colon={false}>
                      <InputNumber
                        size="small"
                        className={stylesConfig.colControl}
                        placeholder="????????????"
                        value={width}
                        disabled={!inflexible}
                        onChange={this.propChange(['style', 'width'])}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={8} type="flex" align="middle" className={stylesConfig.rowBlock}>
                  <Col span={4}>
                    <FormItem label="???????????????">
                      <Select
                        size="small"
                        className={stylesConfig.colControl}
                        placeholder="??????"
                        value={fontFamily}
                        onChange={this.propChange(['style', 'fontFamily'])}
                      >
                        {fontFamilyOptions}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem label=" " colon={false}>
                      <Select
                        size="small"
                        className={stylesConfig.colControl}
                        placeholder="????????????"
                        value={fontSize}
                        onChange={this.propChange(['style', 'fontSize'])}
                      >
                        {fontSizeOptions}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem label=" " colon={false}>
                      <Select
                        size="small"
                        className={stylesConfig.colControl}
                        value={fontStyle}
                        onChange={this.propChange(['style', 'fontStyle'])}
                      >
                        {fontStyleOptions}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label=" " colon={false}>
                      <Select
                        size="small"
                        className={stylesConfig.colControl}
                        value={fontWeight}
                        onChange={this.propChange(['style', 'fontWeight'])}
                      >
                        {fontWeightOptions}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={3}>
                    <FormItem label=" " colon={false}>
                      <ColorPicker
                        className={stylesConfig.color}
                        value={fontColor}
                        onChange={this.propChange(['style', 'fontColor'])}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </div>
              <div className={styles.title}>
                <h2>????????????</h2>
                <Button type="primary" onClick={this.addConditionStyle} shape="circle" icon="plus" size="small" />
              </div>
              <div className={styles.table}>
                <Table
                  bordered={true}
                  pagination={false}
                  columns={this.columns}
                  dataSource={conditionStyles}
                />
              </div>
            </div>
        </div>
        <ConditionStyleConfigModal
          visible={conditionStyleConfigModalVisible}
          visualType={visualType}
          style={currentConditionStyle}
          onCancel={this.closeConditionStyleConfig}
          onSave={this.saveConditionStyleConfig}
        />
      </Modal>
    )
  }
}

export default ColumnStyleConfig
