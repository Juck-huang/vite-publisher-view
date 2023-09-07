import { Card } from "antd"
import { useSelector } from "react-redux"


const Dashboard = () => {
    const userSlice = useSelector((state: { user: any }) => state.user)
    return (
        <>
          <Card
            title="主页"
            bordered={false}
          >
            <h2>欢迎您,{userSlice.name}</h2>
          </Card>
        </>
    )
}
export default Dashboard