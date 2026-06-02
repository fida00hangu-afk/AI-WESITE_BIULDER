import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserdata } from '../redux/userSlice.js'

const useGetCurrentUser = () => {

    const dispatch = useDispatch()

    useEffect(() => {

        const getUser = async () => {
            try {
                const result = await axios.get(
                    'http://localhost:3002/auth/user/getData',
                    { withCredentials: true }
                )

                dispatch(setUserdata(result.data)) // ✅ correct way

            } catch (error) {
                console.log(error)
            }
        }

        getUser()

    }, [dispatch])
}

export default useGetCurrentUser