# CRLC模块重难点问题



## cCRLCD::Init(..)

在初始化过程中，传入的宽度参数是各个机架入口的宽度，不是出口宽度，这个主要用来求半宽以及有载CVC辊形等效凸度。



## cCRLCD::Shft_Pos(..)



### CVC标签

CVC标签的作用是用来选择合适的插值向量。插值向量的配置在cfg_fcrlc.txt中。

在cCRLCD::Shft_Pos(..)中，需要注意CVC标签的问题。

```c
switch ( rprof )
{
    case rp_cvc1 :
    case rp_cvc2 :
    case rp_cvc3 :
    case rp_cvc4 :
      {
        ... 
      }
}
```

不管你rprof选择什么样的辊形，不管是CVC1还是CVC2还是CVC3，最终都要执行case rp_cvc4之后对应的语句。因为前三个case后面没有break。

但是，现在的模型当中，在窜辊计算时，不再用插值的方式计算窜辊位置或窜辊的等效凸度，而是通过和带钢入口宽度以及a1、a2、a3系数相关的计算获得窜辊的等效凸度。因此CVC的标签不管是CVC1还是CVC4，目前已经没有作用。



### dlt是否需要除以2

在开始迭代之前，wr_grn_cr_req需要加上一个pce_wr_cr_dlt变化量，这个变化量在1580产线是除以2的，而在2250产线不除以2。这样设计有什么区别？

```c
    wr_grn_cr_req = wr_grn_cr + pce_wr_cr_dlt / 2
    // wr_grn_cr_req = wr_grn_cr + pce_wr_cr_dlt
```
通过模拟发现，不进行减半操作，原窜辊位置和新窜辊位置之间的关系，更为平缓。