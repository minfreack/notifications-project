const url = import.meta.env.VITE_API_URL;

type NewNotification = {
    description: string,
    to: string | undefined,
}

export const newNotification = async(data : NewNotification) => {
    try {
        const res = await fetch(`${url}/v1/notifications/notification`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        });
        const resData = await res.json();
        return {
            data: resData.data,
            success: resData.success
        }
    } catch (error) {
        return {
            data: {},
            success: false
        }
    }

}

export const getNotifications = async(id: string) => {
    try {
        const res = await fetch(`${url}/v1/notifications/notifications?id=${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
              },
        });
        const resData = await res.json();
        return {
            data: resData.data,
            success: resData.success
        }   
    } catch (error) {
        return {
            data: {},
            success: false
        }
    }
}

export const readNotification = async(id: string) => {
    try {
        const res = await fetch(`${url}/v1/notifications/notification`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({id})
        });
        const resData = await res.json();
        return {
            data: resData.data,
            success: resData.success
        }
    } catch (error) {
        return {
            data: {},
            success: false
        }
    }
}