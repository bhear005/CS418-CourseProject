
function Login(){
    return(
        <div>
            <form>
                <label>Email:</label>
                <input name ="email" type = "email" />
                <br />
                <label>Password:</label>
                <input name = "password" type = "password" />
                <br />
                <button>Submit</button>
            </form>
        </div>
    )
}

export default Login