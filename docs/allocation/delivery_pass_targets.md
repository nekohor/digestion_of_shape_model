# 板形出口目标计算

对于板形模型来说，它的目标不是工艺工程师眼中的PDI目标，板形模型的凸度目标还需综合考虑各种自学习量和补偿值。

## 操作工补偿op_off

目标初始化在cTargtD::Init(..)函数中执行。

PDI板形目标和板形模型角度的板形目度之间有各种自学习量和补偿量的偏差。

首先，PDI目标凸度和目标平直度需要加上操作工的补偿。

下面的代码是在cTargtD::Init(..)外部执行。

```c
        pcFstFSPassD->pcFSStdD[ iter ]->pcEnPceD->pcPce->tgt_profile  =
            psPDI->tgt_profile + psSSys->op_prf_off;

        pcFstFSPassD->pcFSStdD[ iter ]->pcEnPceD->pcPce->tgt_flatness =
            psPDI->tgt_flatness + psSSys->op_flt_off;
```

下面的代码是在cTargtD::Init(..)内部执行，计算初始目标凸度。

```c
    //-------------------------------
    // Calculate the target flatness.
    //-------------------------------
    flt = ( pdi_flt + flt_op_off ) / Physcon.i_units;

    //--------------------------------------
    // Calculate the initial target profile.
    //--------------------------------------

    prf_int = (pdi_prf + prf_op_off);
```

## 凸度自学习量

凸度自学习量的计算如下：

```c
    //--------------------------------------
    // Calculate the target profile vernier.
    //--------------------------------------
    prf_vrn = prf_rm_vrn - prf_rs_vrn;
```

之后将凸度自学习量补到初始目标凸度上。

```c
	prf_pdi_tgt = prf_int * matl_exp_cof;

    prf_int = prf_int * matl_exp_cof + prf_vrn;
```

最后计算目标单位凸度。目标单位凸度才是模型角度的板形目标值。

```c
  pu_prf_tgt = prf_int / pce_thck;
```

