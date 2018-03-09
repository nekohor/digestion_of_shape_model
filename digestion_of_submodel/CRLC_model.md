# CRLC模块重难点问题



## cCRLCD::Init(..)





## cCRLCD::Shft_Pos(..)



### CVC标签

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