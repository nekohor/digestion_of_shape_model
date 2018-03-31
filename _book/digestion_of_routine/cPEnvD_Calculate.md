# cPEnvD::Calculate(..)

这个函数中主要计算包络线。

## F1到F7包络线初始化

包络线计算初始化的过程中，从F1到F7前机架到末机架，计算各个道次的ufd_pu_prf_env以及std_ex_strn_lim，并利用这二者计算出入口（上一道次）有效单位凸度的极限pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_lim。

首先根据弯窜辊的极限值确定弯窜辊包络线的最大最小值。注意，弯辊力极限的最大值对应弯辊力包络线的最小值，弯辊力极限的最小值对应弯辊力包络线的最大值。窜辊的极限最值和包络线的最值同样是相反对应的。

```c
// 弯辊力包络线的赋值
pcFSPassD->pcPEnvD->force_bnd_env[ minl ] =
  pcFSPassD->pcFSStdD[ iter ]->force_bnd_lim[ maxl ];

pcFSPassD->pcPEnvD->force_bnd_env[ maxl ] =
  pcFSPassD->pcFSStdD[ iter ]->force_bnd_lim[ minl ];

// 窜辊位置包络线的赋值
pcFSPassD->pcPEnvD->pos_shft_env[ minl ] =
  pcFSPassD->pcFSStdD[ iter ]->wr_shft_lim[ maxl ];

pcFSPassD->pcPEnvD->pos_shft_env[ maxl ] =
  pcFSPassD->pcFSStdD[ iter ]->wr_shft_lim[ minl ];
```

之后用窜辊位置的极限值，代入pcCRLCD->Crns(..)计算辊系凸度的极限值pce_wr_crn_lim[maxl/minl]。最大值对应最大值，最小值对应最小值。

单位轧制力的大小极限值，直接用单位轧制力赋值。可以见板形模型单位轧制力的验算内容。

```c
for ( i = minl; i <= maxl; i++ )
{
	pcFSPassD->pcPEnvD->force_pu_wid_lim[ i ] =
	  pcFSPassD->pcPEnvD->force_pu_wid;
}
```

用默认窜辊位置wr_shft_nom，代入pcCRLCD->Crns(..)计算辊系凸度pce_wr_crn和wr_br_crn。

计算pcFSPassD->pcPEnvD->dprf_dfrcw，这里的偏导数dprf_dfrcw是用来判断force_pu_wid_lim给force_pu_wid_env赋值的方向。

```c
                //----------------------------------------------------------------
                // Calculate the UFD roll roll gap profile derivative with respect
                // rolling force per unit piece width.
                //----------------------------------------------------------------
                pcFSPassD->pcPEnvD->dprf_dfrcw = 
                    pcFSPassD->pcFSStdD[ iter ]->pcUFDD->Dprf_Dfrcw ( 
                                pcFSPassD->pcPEnvD->force_pu_wid,
                                pcFSPassD->pcFSStdD[ iter ]->pcFSStd->force_bnd_nom,
                                pce_wr_crn,
                                wr_br_crn                           );

                //-----------------------------------------------------------------
                // Initialize the rolling force per unit width piece envelope.
                // Note: The UFD roll gap profile derivative is used for direction.
                //-----------------------------------------------------------------
                if ( 0.0 <= pcFSPassD->pcPEnvD->dprf_dfrcw )
                {
                    pcFSPassD->pcPEnvD->force_pu_wid_env[ minl ] =
                        pcFSPassD->pcPEnvD->force_pu_wid_lim[ minl ];
                    pcFSPassD->pcPEnvD->force_pu_wid_env[ maxl ] =
                        pcFSPassD->pcPEnvD->force_pu_wid_lim[ maxl ];
                }
                else
                {
                    pcFSPassD->pcPEnvD->force_pu_wid_env[ minl ] =
                        pcFSPassD->pcPEnvD->force_pu_wid_lim[ maxl ];
                    pcFSPassD->pcPEnvD->force_pu_wid_env[ maxl ] =
                        pcFSPassD->pcPEnvD->force_pu_wid_lim[ minl ];
                }
```

辊系凸度的极限值赋值给辊系凸度的包络线最大最小值。注意这里，极限值的最小值对应包络线的最大值，极限值的最大值对应包络线的最小值。

```c
                //------------------------------------------------------------
                // Initialize the piece to work roll stack crown and work roll
                // backup roll stack crown envelopes.
                //------------------------------------------------------------
                pcFSPassD->pcPEnvD->pce_wr_crn_env[ minl ] =
                    pcFSPassD->pcPEnvD->pce_wr_crn_lim[ maxl ];
                pcFSPassD->pcPEnvD->wr_br_crn_env[ minl ] =
                    pcFSPassD->pcPEnvD->wr_br_crn_lim[ maxl ];
                pcFSPassD->pcPEnvD->pce_wr_crn_env[ maxl ] =
                    pcFSPassD->pcPEnvD->pce_wr_crn_lim[ minl ];
                pcFSPassD->pcPEnvD->wr_br_crn_env[ maxl ] =
                    pcFSPassD->pcPEnvD->wr_br_crn_lim[ minl ];
```

此时，我们已经有了单位轧制力包络线force_pu_wid_env、弯辊力的包络线force_bnd_env、辊系凸度的包络线pce_wr_crn_env和wr_br_crn_env，利用pcUFDD->Prf(..)计算出UFD单位凸度的包络线ufd_pu_prf_env。

```c
                for ( i = minl; i <= maxl; i++ )
                {
                    //--------------------------------------------------------------
                    // Establish the minimum / maximum UFD roll gap per unit profile
                    // envelope.
                    //--------------------------------------------------------------
                    line_num = __LINE__;
                    pcFSPassD->pcPEnvD->ufd_pu_prf_env[ i ] =
                        pcFSPassD->pcFSStdD[ iter ]->pcUFDD->Prf( 
                             pcFSPassD->pcPEnvD->force_pu_wid_env [ i ],
                             pcFSPassD->pcPEnvD->force_bnd_env    [ i ],
                             pcFSPassD->pcPEnvD->pce_wr_crn_env   [ i ],
                             pcFSPassD->pcPEnvD->wr_br_crn_env    [ i ] ) /
                        pcFSPassD->pcFSStdD[ iter ]->pcExPceD->thick;
                }
```

确定出口应变差极限std_ex_strn_lim。

```c
            for ( i = we; i <= cb; i++ )
            {
                //----------------------------------------------------------------
                // Retrieve the piece critical buckling limits for the given pass.
                //----------------------------------------------------------------
                line_num = __LINE__;
                pcFSPassD->pcPEnvD->std_ex_strn_lim[ i ] = 
                    pcFSPassD->pcLPceD->Crit_Bckl_Lim( i );
            }
```

利用各个道次的ufd_pu_prf_env以及std_ex_strn_lim二者计算出入口（上一道次）有效单位凸度的极限pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_lim。如果当前道次的带钢影响系数接近0，则松弛入口（上一道次）有效单位凸度的极限为正负1。其中ufd单位凸度包络线最小值和边浪极限一起参与计算，ufd单位凸度巴洛熙最大值和中浪极限一起参与计算。

```c
                //-------------------------------------------------
                // Calculate the effective per unit profile limits.
                //-------------------------------------------------
                line_num = __LINE__;
                pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_lim[ minl ] =
                    pcFSPassD->pcFSStdD[ iter ]->pcLRGD->Ef_En_PU_Prf1( 
                               pcFSPassD->pcPEnvD->ufd_pu_prf_env  [ minl ],
                               pcFSPassD->pcPEnvD->std_ex_strn_lim [ we ] );

                line_num = __LINE__;
                pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_lim[ maxl ] =
                    pcFSPassD->pcFSStdD[ iter ]->pcLRGD->Ef_En_PU_Prf1( 
                               pcFSPassD->pcPEnvD->ufd_pu_prf_env  [ maxl ],
                               pcFSPassD->pcPEnvD->std_ex_strn_lim [ cb ] );
```

考虑到最后一道次即末道次的目标可能发生变化，因此最后一道次的有效单位凸度的极限也松弛为正负1。

第一道次入口的pcLPceD->ef_pu_prf赋值给第一道次入口的pcPEnvD->ef_pu_prf_env包络线。同时初始化包络线限制道次数。

```c
        for ( i = minl; i <= maxl; i++ )
        {
            //--------------------------------------------------------
            // Initialize first pass effective entry per unit profile.
            //--------------------------------------------------------
            ( ( cFSPassD* )(pcFstFSPassD->previous_obj) )->pcPEnvD->ef_pu_prf_env[ i ] =
                ( ( cFSPassD* )(pcFstFSPassD->previous_obj) )->pcLPceD->ef_pu_prf;

            //---------------------------------------
            // Initialize the limiting pass envelope.
            //---------------------------------------
            pas_env_lim[ i ] =
                ( ( cFSPassD* )(pcFstFSPassD->previous_obj) )->pcPass->num;
        }
```

## 协调包络线

### 确定包络线最小值组份

move_prv用来指示道次是否前移。是否前移，说明上一机架的有效单位凸度包络线是否存在调整变化的空间。

利用pcLRGD->Ef_Ex_PU_Prf3(..)计算，将上一道次的有效单位凸度包络线下限和本道次的ufd有效凸度包络线代入，获得本道次出口的有效单位凸度包络线下限pcFSPassD->pcPEnvD->ef_pu_prf_env[ minl ]。

```c
            pcFSPassD->pcPEnvD->ef_pu_prf_env[ minl ] = 
                pcFSPassD->pcFSStdD[ iter ]->pcLRGD->Ef_Ex_PU_Prf3 ( 
                               pcFSPassD->pcLPceD->strn_rlf_cof,
                               pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_env[ minl ],
                               pcFSPassD->pcPEnvD->ufd_pu_prf_env[ minl ] );
```

如果本道次出口的有效单位凸度包络线下限低于有效单位凸度极限的下限，则需要进行一系列重新计算。

重新计算中包括ufd_pu_prf、istd_ex_pu_prf、ef_en_pu_prf，并利用上一道次的ef_pu_prf_env来clamp获得入口有效单位凸度（包络线下限）临时值ef_en_pu_prf_buf。

```c
ef_en_pu_prf_buf = 
	cMathUty::Clamp( ef_en_pu_prf,
		pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_env[ minl ],
		pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_env[ maxl ] );
```

之后更新move_prv的指示器。

```c
                    move_prv[ minl ] =
                        ( ef_en_pu_prf_buf !=
                            pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_env[ minl ] ) &&
                        ( pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_env[ minl ] !=
                            pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_env[ maxl ] );
```

更新上一道次或入口有效单位凸度极限的最小值，注意是极限。

```c
pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_lim[ minl ] = ef_en_pu_prf_buf;
```

这时判断move_prv前移指示器的状态，如果不能前移，说明上一道次的有效单位凸度或入口有效单位凸度不存在可调整和变化的空间，则将入口有效包络线的下限赋值给临时量ef_en_pu_prf_buf。

```c
                    if ( !move_prv[ minl ] )
                    {
                        ef_en_pu_prf_buf =
                            pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_env[ minl ];
                    }
```

之后用新的ef_en_pu_prf_buf值和ef_ex_pu_prf值，更新ufd有效单位凸度ufd_pu_prf，涉及的函数是pcLRGD->UFD_PU_Prf3(..)。并利用新的ufd单位凸度ufd_pu_prf、弯辊力和窜辊包络线的下限，计算变化后的辊系凸度pce_wr_crn和wr_br_crn。

再用pcCRLCD->Shft_Pos(..)更新窜辊位置包络线的下限。之后再次重计算（re-calculate）辊系凸度。接着考虑弯辊力包络线下限force_bnd_env_min，重计算（re-calculate）辊系凸度。

```c
                //------------------------------------------------------------------
                // Re-calculate the following composite roll stack crown quantities:
                //     Piece to work roll stack crown
                //     Work roll to backup roll stack crown
                //------------------------------------------------------------------
                line_num = __LINE__;
                pcFSPassD->pcFSStdD[ iter ]->pcCRLCD->Crns( 
                          pcFSPassD->pcPEnvD->pos_shft_env  [ minl ],
                          pcFSPassD->pcPEnvD->angl_pc_env   [ minl ],
                          pcFSPassD->pcPEnvD->pce_wr_crn_env[ minl ],
                          pcFSPassD->pcPEnvD->wr_br_crn_env [ minl ] );
```

在弯窜辊都修正辊系凸度后，确定合适的弯辊力force_bnd_des，设定force_bnd_clmp指示器。

```c
                force_bnd_clmp =
                    force_bnd_des != pcFSPassD->pcPEnvD->force_bnd_env[ minl ];
```

最终更新ufd有效单位凸度包络线的下限ufd_pu_prf_env_min。

如果force_bnd_des不等于弯辊力包络线的下限值，那么还需要调整。重新更新ef_en_pu_prf_buf以及更新上一道次或入口有效单位凸度极限的最小值。

如果未前移，则进行如下计算，从1190到1599行。如果出口应变差std_ex_strn超出出口应变差的极限范围，则进行一系列修正，目前这段修正在模型中被禁止执行。这样设置的原因是避免单位轧制力包络线和辊系凸度做大规模的修改和变化影响生产稳定性，出点浪形问题也是可以接受的。

```c
                // was profile reduced too much
                //if ( std_ex_strn < pcFSPassD->pcPEnvD->std_ex_strn_lim[ cb ] )
                if ( 1 < 0 )
                {..}  
                // strain too high (due to low entry profile)
                //if ( std_ex_strn > pcFSPassD->pcPEnvD->std_ex_strn_lim[ we ] &&
                if ( 0 > 1 &&
                     pcFSPassD->pcFSStdD[ iter ]->pcLRGD->pce_infl_cof >
                         pcFSPassD->pcPEnvD->pcPEnv->pce_infl_cof_mn )
                {..}
                // 1 < 0 和 0 > 1说明这两段调整永远不会执行
```

最后再更新一次本道次的出口有效单位凸度包络线下限。

```c
            pcFSPassD->pcPEnvD->ef_pu_prf_env[ minl ] = 
                pcFSPassD->pcFSStdD[ iter ]->pcLRGD->Ef_Ex_PU_Prf3( 
                           pcFSPassD->pcLPceD->strn_rlf_cof,
                           pcFSPassD->pcPrvAct->pcPEnvD->ef_pu_prf_env[ minl ],
                           pcFSPassD->pcPEnvD->ufd_pu_prf_env         [ minl ] );
```

