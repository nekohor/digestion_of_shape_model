# 平直度自学习

**<u>王宇阳整理</u>**



## 平直度自学习程序梳理

Piece Director将板形设定信息和检测数据、PDI等请求发送给板形反馈调度,由`cSfbDispatch::Receive_Work`接受板形设定参数并处理。之后触发`cShapeFeedbackD::Main`主函数的运行，主函数中调用运行`cShapeFeedbackD::Flt_Adpt`，进而调用`cTargtD::Flt_Adpt`函数进行平直度自学习的计算。

### `cTargtD::Flt_Adpt`

平直度自学习的主函数是`cTargtD`类中的`cTargtD::Flt_Adpt`函数。此函数有6个输入量和两个输出量。函数的定义如下所示。


```cpp
void cTargtD::Flt_Adpt(
    const bool   ssu_ok,                                // [-] SSU model validity indicator
    const bool   ssu_grnt,                              // [-] SSU model granted indicator
    const bool   bnd_enab,                              // [-] roll bending system enabled
                                                        //    indicator
    const float  flt_mea,                               // [mm/mm_in/in_mm/mm] measured
                                                        //    flatness
    const float  force_bnd_off,                         // [mton_eton_kn] operator roll
                                                        //    bending force offset
    const float  dbnd_dflt,                             // [mton/i-unit_eton/i-unit_kn/1-unit]
                                                        //    delta roll bending force / 
                                                        //    delta piece flatness
          float& flt_err,                               // [mton_eton_kn] IN/OUT flatness error
          float& flt_vrn                                // [mton_eton_kn] IN/OUT flatness vernier
                      ) const
```

其中`ssu_ok`和`ssu_grnt`表示SSU板形设定模型的运行状态，`bnd_enab`表示弯辊的使用状态。`flt_mea`是平坦度的测量值，`force_bnd_off`为弯辊力的干预补偿量，`dbnd_dflt`是弯辊对平坦度的偏导数。输出为平坦度的偏差`flt_err`和平坦度的自学习值`flt_vrn`。

函数分为两个步骤，先计算平直度偏差的临时量，再计算自学习的值。平直度偏差的临时量用以下变量名表示。

```c
float flt_err_buf ( 0.0 );
```
第一个步骤的代码如下所示，当模型运行状态不正常或者弯辊设定不能使用时，直接将平直度偏差的临时量设定为0。当模型状态正常，则计算平直度的偏差量。
```c
if ( bnd_enab &&
     ssu_grnt &&
     ssu_ok )
{
    flt_err_buf = ( flt - flt_mea ) * Physcon.i_units * dbnd_dflt;
}
else if ( !ssu_grnt ||
          !bnd_enab )
{

    flt_err_buf = 0.0;
}
```
注意计算公式中：`flt`为目标平坦度，`flt_mea`为测量的平坦度。本处计算`flt_err_buf`为弯辊力的大小，即通过`dbnd_dflt`将平坦度偏差转化为弯辊力偏差。

第二个步骤计算平直度自学习值。在第二个步骤当中，平坦度自学习定义了一个变量，`flt_err_thrshld`，表示平坦度自学习的门槛，这个变量位于cfg_targt.txt，默认值为100kN。当模型条件正常时，如果平直度偏差小于这个值，则只记录偏差，不进行自学习，如下代码所示。

```c
if ( fabs(flt_err_buf) <= pcTargt->flt_err_thrshld )
    flt_err = flt_err_buf;
```
当模型条件正常时，如果平直度偏差大于`flt_err_thrshld`，满足`flt_err_thrshld`最小门槛条件，且操作工又没有调整错误趋势，则进行平直度自学习。如下代码所示。

```c
if ( ( flt_err_buf > pcTargt->flt_err_thrshld &&
       force_bnd_off >= -pcTargt->opr_mx_wrng_corr ) ||
     ( flt_err_buf < -pcTargt->flt_err_thrshld &&
       force_bnd_off <= pcTargt->opr_mx_wrng_corr ) )
{
    ....
}
```

在这里，`opr_mx_wrng_corr`表示操作工对弯辊力做修正的门槛条件，`opr_mx_wrng_corr`同样定义于cfg_targt.txt，默认值为100kN。将`force_bnd_off`和`opr_mx_wrng_corr`一起纳入判断条件，说明当操作工调整过量导致浪形出现时，不触发平直度自学习的计算。

在计算平直度自学习前，先进行限幅检查。

```c
flt_err_buf = cMathUty::
    Clamp( flt_err_buf,
           pcTargt->flt_err_lim[ minl ],
           pcTargt->flt_err_lim[ maxl ] );
```

`flt_err_lim`是平直度偏差的极限值，定义于cfg_targt.txt，默认值为-250kN和+250kN。

限幅检查之后，计算平直度自学习值`flt_vrn`。

```c
flt_vrn =
    flt_vrn + flt_err_buf *
    ( pcTargt->flt_vrn_i_gn / 2.0F + pcTargt->flt_vrn_p_gn) +
    flt_err * ( pcTargt->flt_vrn_i_gn / 2.0F - pcTargt->flt_vrn_p_gn);
```

`flt_vrn`的计算采用PI方式，偏差的选取选用的本块`flt_err_buf`和上一块的`flt_vrn`、`flt_err`，按PI进行分配计算。`flt_vrn_p_gn`和`flt_vrn_i_gn`分别为比例参数和积分参数，在配置文件cfg_targt.txt中定义：

```c
prf_vrn_rm_i_gn = 0.6;
prf_vrn_rm_p_gn = 0.3;
```

这样的配置参数，其实公式后面的`flt_err`是没有用上的，因为后面一项相减后结果为0。平坦度自学习结束以后，对自学习值进行限幅值比较及存储，供下一块PI控制使用。

最后，对平直度自学习值`flt_vrn`限幅并更新平直度偏差`flt_err`。`flt_vrn_lim`为平直度自学习值的极限，在cfg_targt.txt中定义，默认值为-800kN和+800kN。

```c
flt_vrn = cMathUty::
    Clamp( flt_vrn,
           pcTargt->flt_vrn_lim[ minl ],
           pcTargt->flt_vrn_lim[ maxl ] );

flt_err = flt_err_buf;
```

在第二个步骤当中，如果模型条件和弯辊力使用不正常，则衰减平直度自学习值`flt_vrn`并记录平直度偏差`flt_err`。

```c
else if ( !ssu_grnt ||
          !bnd_enab )
{
    //-----------------------------------------------------------
    // Roll bending system was not under model control, bleed-off
    // flatness vernier.
    //-----------------------------------------------------------
    flt_vrn = flt_vrn * pcTargt->flt_vrn_bled;
    //------------------------------------------------
    // Restrict the flatness vernier to within limits.
    //------------------------------------------------
    flt_vrn = cMathUty::
        Clamp( flt_vrn,
               pcTargt->flt_vrn_lim[ minl ],
               pcTargt->flt_vrn_lim[ maxl ] );
    //---------------------------
    // Update the flatness error.
    //---------------------------
    flt_err = flt_err_buf;
}
```

在这里，`flt_vrn_bled`为平直度自学习的衰减系数，默认值为0.9。无论模型条件是否正常，最后都要对平直度自学习值限幅检查并记录和更新平直度偏差量。

## 平直度自学习配置参数
和平直度自学习相关的配置参数名称、位置、默认值和含义如下表所示。
|       配置参数       |   所在配置文件位置    |      默认值      |       含义        |
| :--------------: | :-----------: | :-----------: | :-------------: |
| flt_err_thrshld  | cfg_targt.txt |     100kN     |   平直度偏差的门槛条件    |
| opr_mx_wrng_corr | cfg_targt.txt |     100kN     | 操作工对弯辊力做修正的门槛条件 |
|   flt_err_lim    | cfg_targt.txt | -250kN和+250kN |    平直度偏差的极限值    |
| prf_vrn_rm_i_gn  | cfg_targt.txt |      0.6      |    PI计算的积分参数    |
| prf_vrn_rm_p_gn  | cfg_targt.txt |      0.3      |    PI计算的比例参数    |
|   flt_vrn_bled   | cfg_targt.txt |      0.9      |   平直度自学习的衰减系数   |
|   flt_vrn_lim    | cfg_targt.txt | -800kN和+800kN |   平直度自学习量的极限值   |



## 平直度测量的计算

在`cTargtD::Flt_Adpt`中计算平直度的偏差需要用到测量平直度的值`flt_mea`，那么平直度的测量值`flt_mea`在板形模型中是如何计算的呢？

shapefeedback.cxx中可以找到答案，如下代码所示。

```c
meas_flt     = pcFlatnessSensorD->strn;
meas_flt_vld = pcFlatnessSensorD->strn_ok;
```

测量平直度的值来自`cFlatnessSensorD`实例对象的`strn`属性。

`strn`的计算实现在`cFlatnessSensorD::Init`初始化函数当中，如下代码所示。

```c
strn =
    ( pcSFXFltFbk->state.fib_len[ 0 ] + pcSFXFltFbk->state.fib_len[ num_fib - 1 ] ) *
    (float) pow( ( pcExPceD->width - 2.0F * prf_edg_dist ) /
                 ( fabs( pcSFXFltFbk->state.fib_pos[ 0 ] ) + 
                 fabs( pcSFXFltFbk->state.fib_pos[ num_triangl - 1 ] ) ),
                 2.0F ) /
    2.0F / Physcon.i_units;
```
整个`strn`可以分为两个部分相乘。一个部分是实际的逻辑计算，另一部分为系数，如下公式所示。

$$strn = \frac{L_{OS} - L_{M} + L_{DS} - L_{M}}{2\times10^{5}}\times (\frac{B_{crn}}{B_{flt}})^{2}  $$

其中$L_{OS}$ 、$L_{M}$ 、$L_{DS}$ 分别为操作侧、中部、传动侧的带钢纤维长度。$B_{crn}$是实际出口带钢去除边部距离（一般是40mm）的宽度，$B_{flt}$是操作侧纤维测量点和传动侧纤维测量点的距离。

当然，在`cFlatnessSensorD::Init`的实现当中，还考虑了缺乏操作侧或传动侧平直度数据时，`strn`的计算方式。

注意这里的`fib_len`指的是边部测量的纤维长度相对于中部纤维长度的差值。

类似于`fib_len`这样和平直度检测有关的参数，如纤维长度、纤维位置等，在sfxfltfbk.hxx的`sSFXFltFbk`结构中定义。如下代码所示。

```c
typedef struct
{
    float       fib_len[ num_fib ];                 // [i-units] strip relative fiber
                                                    //    length
                                                    //        [0] = Rho channels 1 - 4
                                                    //        [1] = Rho channels 2 - 4
                                                    //        [2] = Rho channels 3 - 4
                                                    //        [4] = Rho channels 5 - 4
                                                    //        [5] = Rho channels 6 - 4
                                                    //        [6] = Rho channels 7 - 4
    float       fib_len_sd[ num_fib ];              // [i-units] strip relative fiber
                                                    //    length standard deviation
                                                    //        [0] = Rho channels 1 - 4
                                                    //        [1] = Rho channels 2 - 4
                                                    //        [2] = Rho channels 3 - 4
                                                    //        [4] = Rho channels 5 - 4
                                                    //        [5] = Rho channels 6 - 4
                                                    //        [6] = Rho channels 7 - 4
    float       fib_pos[ num_triangl ];             // [mm_in] strip fiber position
                                                    //        [0] = Rho channels 1 - 4
                                                    //        [1] = Rho channels 2 - 4
                                                    //        [2] = Rho channels 3 - 4
                                                    //        [4] = Rho channels 5 - 4
                                                    //        [5] = Rho channels 6 - 4
                                                    //        [6] = Rho channels 7 - 4
    float       fib_pos_sd[ num_triangl ];          // [mm_in] strip fiber position
                                                    //    standard deviation
                                                    //        [0] = Rho channels 1 - 4
                                                    //        [1] = Rho channels 2 - 4
                                                    //        [2] = Rho channels 3 - 4
                                                    //        [4] = Rho channels 5 - 4
                                                    //        [5] = Rho channels 6 - 4
                                                    //        [6] = Rho channels 7 - 4
    float       qtr_bckl;                           // [i-units] strip quarter buckle
    float       qtr_bckl_sd;                        // [i-units] strip quarter buckle
    float       lvl[ num_lvl ];                     // [i-units] strip level                                                   //        [0] = Rho channels 1 - 5
                                                    //        [0] = Rho channels 1 - 7
                                                    //        [1] = Rho channels 2 - 6                 
    float       lvl_sd[ num_lvl ];                  // [i-units] strip level standard
                                                    //    deviation
                                                    //        [0] = Rho channels 1 - 7
                                                    //        [1] = Rho channels 2 - 6
    bool        fib_len_ok[ num_fib ];              // [-] strip relative fiber
                                                    //    length validity indicator
                                                    //        [0] = Rho channels 1 - 4
                                                    //        [1] = Rho channels 2 - 4
                                                    //        [2] = Rho channels 3 - 4
                                                    //        [4] = Rho channels 5 - 4
                                                    //        [5] = Rho channels 6 - 4
                                                    //        [6] = Rho channels 7 - 4
    bool        fib_pos_ok[ num_triangl ];          // [-] strip fiber position
                                                    //    validity indicator
                                                    //        [0] = Rho channels 1 - 4
                                                    //        [1] = Rho channels 2 - 4
                                                    //        [2] = Rho channels 3 - 4
                                                    //        [4] = Rho channels 5 - 4
                                                    //        [5] = Rho channels 6 - 4
                                                    //        [6] = Rho channels 7 - 4
    bool        qtr_bckl_ok;                        // [-] quarter buckle validity
                                                    //    indicator
    bool        lvl_ok[ num_lvl ];                  // [-] strip level validity
                                                    //    indicator
                                                    //        [0] = Rho channels 1 - 7
                                                    //        [1] = Rho channels 2 - 6
} sSFXFltFbk;
```

`fib_len`代表不同位置的纤维和中心纤维的相对长度差。`fib_pos`代表纤维的横向位置（以宽度中心为零点）。`lvl`代表对称纤维的两侧偏差。

需要注意的是，以上这些量的计算是在`cSfbDispatch::Load_Feedback_Objects`中完成的。`fib_len`的计算分头部和中部。

```cpp
pcFlatnessSensorD->pcSFXFltFbk->state.fib_pos[0]  = 
    0.5F*pcSched->pcFMD->state.f_Width - mill().data().flatEdgeDist;

pcFlatnessSensorD->pcSFXFltFbk->state.fib_pos[num_triangl - 1]  = 
    -pcFlatnessSensorD->pcSFXFltFbk->state.fib_pos[0];

pcFlatnessSensorD->pcSFXFltFbk->state.fib_len[0]  = 
                pcSched->pcFMD->state.f_Mid_Flatness + 0.5F* pcSched->pcFMD->state.f_Mid_Level;

pcFlatnessSensorD->pcSFXFltFbk->state.fib_len[num_fib - 1]  = 
        pcSched->pcFMD->state.f_Mid_Flatness - 0.5F* pcSched->pcFMD->state.f_Mid_Level;

pcFlatnessSensorD->pcSFXFltFbk->state.lvl[0]  = pcSched->pcFMD->state.f_Mid_Level;
```

以上代码涉及到的`flatEdgeDist`，和`profEdgeDist`一起在cfg_mill.txt中设定，默认值二者均为40微米。

以带钢头部为例（带钢中段与其类似），实际上`f_Head_Flatness`为对称平直度，`f_Head_Level`为非对称平直度。从如下write_ssu_log.cxx中的代码可以看出。

```c
fprintf( cfPtr, " Hd  Sym: %4d",(int)pcSched->pcFMD->state.f_Head_Flatness);
fprintf( cfPtr, " ASym: %4d",(int)pcSched->pcFMD->state.f_Head_Level);
fprintf( cfPtr, " Vld: %s", pcSched->pcFMD->state.b_Head_Flatness_Valid ? "T":"F");
```
