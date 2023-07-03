import path from 'path'
import { rename, readdir } from 'fs/promises'
import Conf, { Schema } from 'conf'
import { parse, stringify } from 'yaml'

const schema: Schema<any> = {
  VERSION: { type: 'string'},
  DIRPATH: { type: 'string', default: '' },
  SRCPART: { type: 'string', default: '' },
  REPLACE: { type: 'string', default: '' },
}

const config = new Conf({
  fileExtension: 'yaml',
  serialize: stringify,
  deserialize: parse,
  cwd: process.cwd(),
  schema
})

/**
 * 批量修改文件名称
 * DIRPATH            文件夹路径 这里需要填写绝对地址
 * SRCPART            文件名称开头相同的部分
 * REPLACE            需要替换的部分 默认为空 就是删除相同部分
 */

async function main (dirpath: string, src: string, replace: string) {
  const contentList = await readdir(dirpath, { withFileTypes: true })
  const fileList = contentList.filter(dirent => dirent.isFile())
  fileList.forEach(dirent => {
    if (dirent.name.startsWith(src)) {
      const target = dirent.name.replace(src, replace)
      rename(path.resolve(dirpath, dirent.name), path.resolve(dirpath, target)).catch(e => { })
      console.log('[rename]', target, 'success')
    }
  })
}

async function boot() {
  try {
    console.log("env::", config.store);
    if (config.get('DIRPATH') && config.get('SRCPART')) {
      main(config.get('DIRPATH'), config.get('SRCPART'), config.get('REPLACE') || "")
    }
  } catch (error) {
    throw error;
  }
}

boot();
