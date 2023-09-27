import { Modal } from 'antd'

// 实时日志模态框
const RealTimeLogModal = (props: any) => {

  const { isLogModalOpen } = props

  const handleOk = () => {

  }

  const handleCancel = () => {

  }

  return (
    <>
        <Modal
          title="实时日志预览"
          open={isLogModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >

        </Modal>
    </>
  )
}

export default RealTimeLogModal
