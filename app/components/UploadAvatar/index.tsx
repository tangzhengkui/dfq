import React, { GetDerivedStateFromProps } from 'react'
import Avatar from '../Avatar'
import { Upload, message as Message, Button } from 'antd'
const styles = require('./UploadAvatar.less')
import api from 'utils/api'
import { setToken, getToken } from 'utils/request'

interface IUploadAvatar {
  id?: number
  callback?: (path: string) => any
}
interface IUploadAvatarProps {
  type: string
  path: string
  xhrParams: IUploadAvatar
}
interface IUploadAvatarState {
  currentPath: string
}

export class UploadAvatar extends React.PureComponent<
  IUploadAvatarProps,
  IUploadAvatarState
> {
  constructor(props) {
    super(props)
    this.state = {
      currentPath: ''
    }
  }
  private beforeUpload = (file) => {
    const re = /image\/(png|jpg|jpeg|gif)/
    const isJPG = re.test(file.type)
    if (!isJPG) {
      Message.error('You can only upload JPG file!')
    }
    const isLt1MB = file.size / 1024 / 1024 > 1
    if (isLt1MB) {
      Message.error('Image must smaller than 1MB!')
    }
    return !!(isJPG && !isLt1MB)
  }
  private handleChange = (info) => {
    const { xhrParams } = this.props
    if (info.file.status === 'done') {
      const response = info.file.response
      if (response && response.header && response.header.code >= 200) {
        const avatar = response.payload.avatar
        const token = response.header.token
        if (xhrParams && typeof xhrParams.callback === 'function') {
          xhrParams.callback(avatar)
        }
        setToken(token)
      }
    }
  }

  public static getDerivedStateFromProps: GetDerivedStateFromProps<
    IUploadAvatarProps,
    IUploadAvatarState
  > = (nextProps, prevState) => {
    const { path } = nextProps
    if (path && path.length) {
      return { currentPath: path }
    }
  }

  public render() {
    const { type, xhrParams } = this.props
    const { currentPath } = this.state
    const TOKEN = { Authorization: getToken() }
    let action = ''
    if (type === 'profile') {
      if (xhrParams && xhrParams.id) {
        action = `${api.user}/${xhrParams.id}/avatar`
      }
    } else if (type === 'organization') {
      if (xhrParams && xhrParams.id) {
        action = `${api.organizations}/${xhrParams.id}/avatar`
      }
    }
    return (
      <div className={styles.avatar}>
        <Avatar path={currentPath} size="large" enlarge={true} />
        <div className={styles.uploadAvatar}>
          <div className={styles.uploadTitle}>???????????????</div>
          <Upload
            name="file"
            showUploadList={false}
            headers={TOKEN}
            action={action}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
          >
            <Button size="large">????????????</Button>
          </Upload>
          <p className={styles.uploadDesc}>?????????????????????1MB</p>
        </div>
      </div>
    )
  }
}

export default UploadAvatar
