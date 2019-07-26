import os
#递归遍历目录下所有文件路径集合
#path = "F:\\water_wyh\\json"
def GetFilesFromPath(path):
    lstFiles = []
    parents = os.listdir(path)
    for parent in parents:
        child = os.path.join(path,parent)
        if os.path.isdir(child):
            GetFilesFromPath(child)
        else:
            lstFiles.append(child)
    return lstFiles

