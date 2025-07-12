import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <header className="d-flex flex-wrap justify-content-center py-3 border-bottom">Header </header>
      </Head>
      <main>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-3 p-3'>
              <div className='bg-white shadow-md p-3'>
                filters
              </div>
            </div>
            <div className='col-9 p-3'>
              <div className='bg-white shadow-md p-3'>
                items
              </div>
            </div> 
          </div>

        </div>
      </main>
    </>
  )
}
