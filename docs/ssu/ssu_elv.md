# 板形评估

分配阶段结束后就进入评估阶段。

评估的手段主要是从前道次机架往后依次对各个机架的浪形情况进行评估。如果机架的出口应变差超出了死区范围，那么模型就试着利用弯辊去消除多余的应变差。如果弯辊不能对浪形情况进行修正，对凸度削弱因子进行调整，最终获得合适的板形。

板形评估的过程主要在cShapeSetupD::Evaluate(..)函数中执行。

## 评估准备工作

板形评估的作用是用来评估带钢的浪形是否满足要求。因此会设定flt_ok指示器。

```C
pcLPceD->flt_ok = true;
```

之后更新横向带钢模型，获得最新的应变释放系数、带钢弹性模量以及最新的屈曲判别极限。

```c
    pcLPceD->Update( pcFSStdD->pcExPceD->temp_avg,
                     pcFSStdD->pcExPceD->width,
                     thick,
                     pcFSStdD->pcExPceD->tension );
```

如果当前机架非空过，则计算当前机架轧制力相对于出口带钢厚度的偏导数，供后面横向辊缝模型参数的更新使用。

```c
if ( !pcFSStdD->pcRollbite->Calculate_DForce_DExthick( 0.01F ) )
{
    EMSG << "Evaluate: PID="
    << pcFSStdD->pcExPceD->pcPce->prod_id
    << ", invalid ROLLBITE dforce_dexgag"
    << END_OF_MESSAGE;
}
```

横向辊缝模型参数的更新。

```c
    pcFSStdD->pcLRGD->Update( pcFSStdD->dummied,
                              pcFSStdD->pcExPceD->width,
                              pcFSStdD->pcEnPceD->thick,
                              thick,
                              force_pu_wid,
                              pcFSStdD->pcEnPceD->pcPce->family,
                              pcFSStdD->pcRollbite->DForce_DExthick(),
                              pcFSStdD->fs,
                              pcFSStdD->arcon,
                              pcLPceD );
```

之后利用cCRLCD::Crns(..)计算带钢-工作辊和工作辊-支承辊的辊系凸度。

```c
    pcFSStdD->pcCRLCD->Crns ( pcFSStdD->wr_shft,
                              pcFSStdD->angl_pc,
                              pcFSStdD->pcCRLCD->pce_wr_cr,
                              pcFSStdD->pcCRLCD->wr_br_cr);
```

## 单位凸度和浪形的计算

准备工作结束后，利用pcUFDD->Prf (..)计算pcLPceD->ufd_pu_prf。

```c
        pcLPceD->ufd_pu_prf = 
            pcFSStdD->pcUFDD->Prf ( force_pu_wid,
                                    force_bnd,
                                    pcFSStdD->pcCRLCD->pce_wr_cr,
                                    pcFSStdD->pcCRLCD->wr_br_cr )/ thick;
```

用上一个机架的有效单位凸度和当前机架的UFD均载辊缝凸度，计算出口应变差。

```c
        pcLPceD->strn = pcFSStdD->pcLRGD->Std_Ex_Strn1( pcPrvLPceD->ef_pu_prf,
                                                        pcLPceD->ufd_pu_prf );
```

如果应变差超出了屈曲判别的极限，且弯辊力设定值还可以修改，则根据当前的应变差重新计算UFD均载辊缝单位凸度，并更新弯辊力的值，最后再次更新应变差。

这是如果应变差还是不满足屈曲判别的要求，那么修正带钢的凸度改变削弱因子。

```c
pcFSStdD->pcLRGD->Cor_Prf_Chng_Attn_Fac_Sup ( 
                  bckl_lim,
                  pcLPceD->strn );
```

最后更新出口应变差和单位有效凸度，并根据前两者计算新的凸度prf。