import AccountForm from '../components/AccountForm'

export default function Login({ notify, navigate }) {
  return <><div className="page-intro page-intro--compact"><span className="eyebrow">YOUR NEXT FAVORITE IS WAITING</span><h1>Come on <em>in.</em></h1></div><AccountForm notify={notify} navigate={navigate} /></>
}
