import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Image, Message, Dimmer, Loader, Input, Label} from 'semantic-ui-react';
import Logo from '../assets/crownred.png'
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"

const Login = () => {
    const [creds, setCreds] = useState({
        email: '',
        pass: ''
    })
    const { login, currentUser } = useAuth()
    const [err, setErr] = useState(false)
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    useEffect(()=>{
        if(currentUser !== null){
            window.location.pathname = '/dashboard'
        }
    },[currentUser])

    const handleFormChange = (e) => {
        const { value, name } = e.target
        
        setCreds({
          ...creds,
          [name]: value
        })
    }

    const handleSubmitCreds = async(e) => {
        setLoading(true)

        try {
            setErr(false)

            await login(`${creds.email}@ninonggrab.com`, creds.pass)
            setTimeout(()=>{
                setLoading(false)
                history.push("/frontdesk")
            },1000)
        } catch {
            setTimeout(()=>{
                setLoading(false)
                setErr(true)
            },1000)
        }
    }

    return (
        <div className="login">
            <Modal
                size={'mini'}
                open={true}
            >
                <Image src={Logo} style={{paddingRight: '1rem', width: '80px', marginLeft: '1rem', marginTop: '1rem'}}></Image>
                <Modal.Header>
                Ninong Grab Admin Login
                </Modal.Header>
                <Dimmer.Dimmable as={Modal.Content} dimmed={loading}>
                    <Dimmer active={loading} inverted>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    <Form>
                        <Form.Field>
                        <label>Email</label>
                        <Input labelPosition='right' type='text' placeholder='Amount'>
                            <input placeholder='Email' name="email" onChange={handleFormChange} value={creds.email}/>      
                            <Label>@ninonggrab.com</Label>
                        </Input>
                        </Form.Field>
                        <Form.Field>
                        <label>Password</label>
                        <input placeholder='Password' type="password" name="pass" onChange={handleFormChange} value={creds.pass}/>
                        </Form.Field>
                        <Form.Field>
                        </Form.Field>
                        <Message
                            error={!err}
                            header={'Invalid Login'}
                            content='Please try again.'
                        />
                    </Form>
                </Dimmer.Dimmable>
                <Modal.Actions>
                <Button onClick={handleSubmitCreds} color='red' disabled={!(creds.email !== "" && creds.pass !== "")}>Login</Button>
                </Modal.Actions>
            </Modal>
        </div>
    )
}

export default Login