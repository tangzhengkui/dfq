/*
 * <<
 * Davinci
 * ==
 * Copyright (C) 2016 - 2017 EDP
 * ==
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * >>
 */

import React, { FC, Suspense } from 'react'
import classnames from 'classnames'
import { Form, Row, Col, Radio as AntRadio, Icon } from 'antd'
import RelativeDatePicker from 'components/RelativeDatePicker'
import Select from '../../Control/Select'
import Radio from '../../Control/Radio'
import Date from '../../Control/Date'
import DateRange from '../../Control/DateRange'
import InputText from '../../Control/InputText'
import TreeSelect from '../../Control/TreeSelect'
import Slider from '../../Control/Slider'
import NumberRange from 'components/NumberRange'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { RadioChangeEvent } from 'antd/lib/radio'
import { TreeNode } from 'antd/lib/tree-select'
import { IControl, IControlOption } from '../../types'
import {
  ControlTypes,
  ControlDefaultValueTypes,
  ControlOptionTypes,
  IS_DATE_TYPE
} from '../../constants'
import utilStyles from 'assets/less/util.less'
const FormItem = Form.Item
const RadioGroup = AntRadio.Group
const RadioButton = AntRadio.Button

interface IDefaultValueProps {
  form: WrappedFormUtils
  controlBase: Omit<IControl, 'relatedItems' | 'relatedViews'>
  defaultValueOptions: Array<IControlOption | object>
  defaultValueLoading: boolean
  onDefaultValueTypeChange: (e: RadioChangeEvent) => void
  onGetDefaultValueOptions: () => void
}

const DefaultValue: FC<IDefaultValueProps> = ({
  form,
  controlBase,
  defaultValueOptions,
  defaultValueLoading,
  onDefaultValueTypeChange,
  onGetDefaultValueOptions
}) => {
  const { getFieldDecorator } = form
  const {
    type,
    multiple,
    optionType,
    defaultValueType,
    customOptions
  } = controlBase

  const colSpan = { xxl: 12, xl: 18 }
  const itemCols = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 }
  }

  let component

  switch (type) {
    case ControlTypes.Select:
      component = (
        <Row>
          <Col {...colSpan}>
            <FormItem label="?????????" {...itemCols}>
              {[ControlOptionTypes.Auto, ControlOptionTypes.Manual].includes(
                optionType
              ) && (
                <a onClick={onGetDefaultValueOptions}>
                  {`???????????? `}
                  {defaultValueLoading && <Icon type="loading" />}
                </a>
              )}
              {getFieldDecorator(
                'defaultValue',
                {}
              )(
                <Select
                  control={controlBase}
                  options={
                    optionType === ControlOptionTypes.Custom
                      ? customOptions || []
                      : (defaultValueOptions as IControlOption[])
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
      )
      break
    case ControlTypes.Radio:
      component = (
        <Row>
          <Col {...colSpan}>
            <FormItem label="?????????" {...itemCols}>
              {[ControlOptionTypes.Auto, ControlOptionTypes.Manual].includes(
                optionType
              ) && (
                <a onClick={onGetDefaultValueOptions}>
                  {`???????????? `}
                  {defaultValueLoading && <Icon type="loading" />}
                </a>
              )}
              {getFieldDecorator('defaultValue', {
                rules: [{ required: true, message: '?????????????????????????????????' }]
              })(
                <Radio
                  control={controlBase}
                  options={
                    optionType === ControlOptionTypes.Custom
                      ? customOptions || []
                      : (defaultValueOptions as IControlOption[])
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
      )
      break
    case ControlTypes.Date:
      component = (
        <Row>
          <Col {...colSpan}>
            <FormItem label="?????????" {...itemCols}>
              {defaultValueType === ControlDefaultValueTypes.Fixed ? (
                <Suspense fallback={null}>
                  {getFieldDecorator(
                    'defaultValue',
                    {}
                  )(<Date control={controlBase} size="default" />)}
                </Suspense>
              ) : (
                getFieldDecorator('defaultValue', {})(<RelativeDatePicker />)
              )}
            </FormItem>
          </Col>
        </Row>
      )
      break
    case ControlTypes.DateRange:
      component =
        defaultValueType === ControlDefaultValueTypes.Fixed ? (
          <Row>
            <Col {...colSpan}>
              <FormItem label="?????????" {...itemCols}>
                {getFieldDecorator(
                  'defaultValue',
                  {}
                )(<DateRange control={controlBase} />)}
              </FormItem>
            </Col>
          </Row>
        ) : (
          <>
            <Row>
              <Col {...colSpan}>
                <FormItem label="?????????-??????" {...itemCols}>
                  {getFieldDecorator(
                    'defaultValueStart',
                    {}
                  )(<RelativeDatePicker />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col {...colSpan}>
                <FormItem label="?????????-??????" {...itemCols}>
                  {getFieldDecorator(
                    'defaultValueEnd',
                    {}
                  )(<RelativeDatePicker />)}
                </FormItem>
              </Col>
            </Row>
          </>
        )
      break
    case ControlTypes.InputText:
      component = (
        <Row>
          <Col {...colSpan}>
            <FormItem label="?????????" {...itemCols}>
              {getFieldDecorator('defaultValue', {})(<InputText />)}
            </FormItem>
          </Col>
        </Row>
      )
      break
    case ControlTypes.NumberRange:
      component = (
        <Row>
          <Col {...colSpan}>
            <FormItem label="?????????" {...itemCols}>
              {getFieldDecorator('defaultValue', {})(<NumberRange />)}
            </FormItem>
          </Col>
        </Row>
      )
      break
    case ControlTypes.Slider:
      component = (
        <Row>
          <Col {...colSpan}>
            <FormItem label="?????????" {...itemCols}>
              {getFieldDecorator('defaultValue', {
                rules: [{ required: true, message: '?????????????????????????????????' }]
              })(<Slider control={controlBase} />)}
            </FormItem>
          </Col>
        </Row>
      )
      break
    case ControlTypes.TreeSelect:
      component = (
        <Row>
          <Col {...colSpan}>
            <FormItem label="?????????" {...itemCols}>
              <a onClick={onGetDefaultValueOptions}>
                {`???????????? `}
                {defaultValueLoading && <Icon type="loading" />}
              </a>
              {getFieldDecorator(
                'defaultValue',
                {}
              )(
                <TreeSelect
                  control={controlBase}
                  options={defaultValueOptions as TreeNode[]}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      )
      break
  }

  return (
    <>
      <Row>
        <Col
          className={classnames({
            [utilStyles.hide]: !(IS_DATE_TYPE[type] && !multiple)
          })}
          {...colSpan}
        >
          <FormItem label="???????????????" {...itemCols}>
            {getFieldDecorator(
              'defaultValueType',
              {}
            )(
              <RadioGroup onChange={onDefaultValueTypeChange}>
                <RadioButton value={ControlDefaultValueTypes.Fixed}>
                  ?????????
                </RadioButton>
                <RadioButton value={ControlDefaultValueTypes.Dynamic}>
                  ?????????
                </RadioButton>
              </RadioGroup>
            )}
          </FormItem>
        </Col>
      </Row>
      {component}
    </>
  )
}

export default DefaultValue
