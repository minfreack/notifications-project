const url = import.meta.env.VITE_API_URL;

type NewNotification = {
    description: string,
    to: string | undefined,
}

export const newNotification = async(data : NewNotification) => {
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
}

export const getNotifications = async(id: string) => {
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
}

export const readNotification = async(id: string) => {
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
}