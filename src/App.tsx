import React, { FC, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import './App.css';

export interface AppProps {

}

export interface DataApiType {
  code: number;
  msg: string;
  name: string;
  qlogo: string;
  qq: string;
}

const App: FC<AppProps> = () => {
  const defaultInfo = {
    code: 0,
    msg: '',
    name: '',
    qlogo: '',
    qq: ''
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<DataApiType>({...defaultInfo});

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    let searchText = event.target.value
    if(searchText) {
      if(!/^[1-9][0-9]{4,11}$/.test(searchText)) {
        alert('请输入正确QQ号');
        return false;
      }
      setLoading(true);
      axios.get(`https://api.uomg.com/api/qq.info?qq=${searchText}`)
      .then((res) => {
        if(res.status === 200) {
          const { code= 0, msg=''}:DataApiType = res?.data || {}
          if(code === 1) {
            setInfo(res.data);
          } else {
            alert(msg);
            setInfo({...defaultInfo})
          }
        } else {
          alert('获取数据出错');
        }
      })
      .catch((_) => {
        alert('网络异常');
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setInfo({...defaultInfo})
    }
  }

  const onChange = useCallback(
    debounce((data:React.ChangeEvent<HTMLInputElement>) => onSearch(data), 1000),
    [],
  );

  return (
    <div className='warp'>
      <div className='title'>QQ号查询</div>
      <div className='search'>
        <span>QQ</span>
        <input type="text" onChange={onChange} placeholder="请输入QQ号"/>
      </div>
      <div className='info-box'>
        {
          loading ? <div>loading...</div> : <>
            {
              info.code === 1 ? <div className='qq-info'>
              <img src={info.qlogo} className='logo' />
              <div className='name'>
                <span>{info.name ? info.name:'昵称为空或特殊字符'}</span>
                <span>{info.qq}</span>
              </div>
            </div> : <div>暂无数据</div>
            }
          </>
        }
      </div>
    </div>
  );
}

export default App;
