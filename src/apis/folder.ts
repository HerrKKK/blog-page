import myAxios from "@/apis/axios";

export const getSubFolders = (success: Function, failure: Function) => {
    myAxios.request({
        method: 'GET',
        url: '/folder?url=',
    }).then((res: any) => {
        if (res.data.status === 'success') {
            success(res)
            return
        }
        failure(res)
    })
}

export const putFolder = (data: any,
                            success: Function,
                            failure: Function) => {
    myAxios.request({
        method: 'PUT',
        url: '/folder',
        data: data
    }).then((res: any) => {
        if (res.data.status === 'success') {
            success(res)
            return
        }
        failure(res)
    })
}

export const deleteFolder = (data: any,
                          success: Function,
                          failure: Function) => {
    myAxios.request({
        method: 'DELETE',
        url: '/folder',
        data: data
    }).then((res: any) => {
        if (res.data.status === 'success') {
            success(res)
            return
        }
        failure(res)
    })
}