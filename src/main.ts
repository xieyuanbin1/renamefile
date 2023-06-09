import * as ini from 'ini'
import fs from 'fs'
import path from 'path'
import { rename, readdir, access, writeFile } from 'fs/promises'

const ENV_PATH = path.resolve(process.cwd(), "config.ini");

/**
 * 批量修改文件名称
 * DIRPATH            文件夹路径 这里需要填写绝对地址
 * SRCPART            文件名称开头相同的部分
 * REPLACE            需要替换的部分 默认为空 就是删除相同部分
 */

async function parseEnv () {
  try {
    await access(ENV_PATH, fs.constants.F_OK)
    const config: Record<string, any> = ini.parse(fs.readFileSync(ENV_PATH, 'utf-8'))
    const env: Record<string, any> = {}
    for(const item in config) {
      if(typeof config[item] === 'string') {
        env[item] = config[item]
      }
    }
    return env
  } catch (error) {
    await writeFile(ENV_PATH, '', 'utf8')
    return {}
  }
}

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
    const env = await parseEnv();
    console.log("env::", env);
    if (env.DIRPATH && env.SRCPART) {
      main(env.DIRPATH, env.SRCPART, env.REPLACE || "")
    }
  } catch (error) {
    throw error;
  }
}

boot();
