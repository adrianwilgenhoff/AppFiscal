import React, { Component } from 'react'
import { Carousel, Layout } from 'antd';
import './Landing.css';
const { Content } = Layout
export default class Landing extends Component {
    render() {
        return (

            <Layout.Content className="landing-content">


            </Layout.Content>
            // <Carousel autoplay>
            //     <div>
            //         <h3><img src="/background.jpg" /></h3>
            //     </div>
            //     <div>
            //         <h3><img src="/background.jpg" /></h3>
            //     </div>
            //     <div>
            //         <h3>3</h3>
            //     </div>
            //     <div>
            //         <h3>4</h3>
            //     </div>
            // </Carousel>
        )
    }
}
